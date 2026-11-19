
const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");

const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const ai = env.geminiApiKey
  ? new GoogleGenAI({ apiKey: env.geminiApiKey })
  : null;

const responseSchema = {
  type: Type.OBJECT,
  required: [
    "atsScore",
    "scoreBreakdown",
    "issues",
    "strengths",
    "bulletRewrites",
    "keywordsPresent",
    "keywordsMissing",
    "summary",
  ],
  properties: {
    atsScore: {
      type: Type.NUMBER,
      description: "ATS-readiness score from 0 to 100",
    },
    scoreBreakdown: {
      type: Type.OBJECT,
      required: ["keywords", "formatting", "impact", "clarity"],
      properties: {
        keywords: { type: Type.NUMBER, description: "0-25" },
        formatting: { type: Type.NUMBER, description: "0-25" },
        impact: { type: Type.NUMBER, description: "0-25" },
        clarity: { type: Type.NUMBER, description: "0-25" },
      },
    },
    issues: {
      type: Type.ARRAY,
      description: "Exactly 5 prioritized issues",
      items: {
        type: Type.OBJECT,
        required: ["title", "severity", "explanation", "fix"],
        properties: {
          title: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
          },
          explanation: { type: Type.STRING },
          fix: { type: Type.STRING },
        },
      },
    },
    strengths: {
      type: Type.ARRAY,
      description: "Exactly 5 strengths",
      items: {
        type: Type.OBJECT,
        required: ["title", "evidence"],
        properties: {
          title: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
      },
    },
    bulletRewrites: {
      type: Type.ARRAY,
      description: "5-10 weak bullets rewritten to be stronger and ATS-friendly",
      items: {
        type: Type.OBJECT,
        required: ["section", "original", "rewritten", "rationale"],
        properties: {
          section: { type: Type.STRING },
          original: { type: Type.STRING },
          rewritten: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
      },
    },
    keywordsPresent: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    keywordsMissing: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    summary: {
      type: Type.STRING,
      description: "One short paragraph overall verdict",
    },
  },
};

const analysisValidator = z.object({
  atsScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywords: z.number().min(0).max(25),
    formatting: z.number().min(0).max(25),
    impact: z.number().min(0).max(25),
    clarity: z.number().min(0).max(25),
  }),
  issues: z
    .array(
      z.object({
        title: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        explanation: z.string(),
        fix: z.string(),
      })
    )
    .min(1),
  strengths: z
    .array(
      z.object({
        title: z.string(),
        evidence: z.string(),
      })
    )
    .min(1),
  bulletRewrites: z
    .array(
      z.object({
        section: z.string(),
        original: z.string(),
        rewritten: z.string(),
        rationale: z.string(),
      })
    )
    .default([]),
  keywordsPresent: z.array(z.string()).default([]),
  keywordsMissing: z.array(z.string()).default([]),
  summary: z.string(),
});

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isKeywordInText(keyword, rawText) {
  if (!keyword || !rawText) return false;
  const cleanKw = keyword.trim().toLowerCase();
  const cleanText = rawText.toLowerCase();

  // 1. Direct contains check
  if (cleanText.includes(cleanKw)) return true;

  // 2. Strip .js or dots (e.g. "express.js" -> "express", "node.js" -> "node", "react.js" -> "react")
  const strippedKw = cleanKw.replace(/\.js\b/g, "").replace(/\./g, "").trim();
  if (strippedKw.length >= 3) {
    const escaped = escapeRegex(strippedKw);
    const regex = new RegExp(`(?:\\b|_)${escaped}(?:\\b|_)`, "i");
    if (regex.test(cleanText)) return true;
  }

  // 3. Technical aliases and synonyms
  const aliases = {
    mongodb: ["mongo"],
    postgresql: ["postgres", "psql"],
    javascript: ["js", "ecmascript"],
    typescript: ["ts"],
    "restful api": ["rest api", "rest apis", "restful", "rest"],
    "rest api": ["restful", "rest apis", "rest"],
    react: ["reactjs", "react.js", "react native"],
    angular: ["angularjs", "angular.js"],
    vue: ["vuejs", "vue.js"],
    "c++": ["cpp"],
    "c#": ["csharp"],
    ".net": ["dotnet", "asp.net"],
    aws: ["amazon web services"],
    gcp: ["google cloud", "google cloud platform"],
    k8s: ["kubernetes"],
    kubernetes: ["k8s"],
    "ci/cd": ["cicd", "continuous integration"],
    "machine learning": ["ml"],
    "deep learning": ["dl"],
    "object-oriented programming": ["oop", "oops"],
    agile: ["scrum", "kanban", "sprint"],
  };

  if (aliases[cleanKw]) {
    for (const alias of aliases[cleanKw]) {
      const escaped = escapeRegex(alias);
      const regex = new RegExp(`(?:\\b|_)${escaped}(?:\\b|_)`, "i");
      if (regex.test(cleanText)) return true;
    }
  }

  for (const [canonical, altList] of Object.entries(aliases)) {
    if (altList.includes(cleanKw) && cleanText.includes(canonical)) {
      return true;
    }
  }

  // 4. Word boundary check
  const escapedKw = escapeRegex(cleanKw);
  const kwRegex = new RegExp(`(?:\\b|_)${escapedKw}(?:\\b|_)`, "i");
  return kwRegex.test(cleanText);
}

function reconcileKeywords(rawText, analysis) {
  if (!analysis) return analysis;

  const presentSet = new Set();
  const presentLowerMap = new Map(); // lowercase -> original casing
  const missingList = [];

  for (const kw of analysis.keywordsPresent || []) {
    if (!kw || !kw.trim()) continue;
    const trimmed = kw.trim();
    const lower = trimmed.toLowerCase();
    if (!presentLowerMap.has(lower)) {
      presentLowerMap.set(lower, trimmed);
      presentSet.add(trimmed);
    }
  }

  for (const kw of analysis.keywordsMissing || []) {
    if (!kw || !kw.trim()) continue;
    const trimmed = kw.trim();
    const lower = trimmed.toLowerCase();

    // If it's already in present, skip adding to missing
    if (presentLowerMap.has(lower)) continue;

    // Check if the resume text actually mentions this keyword
    if (isKeywordInText(trimmed, rawText)) {
      // It is present in the resume! Move to present!
      presentLowerMap.set(lower, trimmed);
      presentSet.add(trimmed);
    } else {
      missingList.push(trimmed);
    }
  }

  analysis.keywordsPresent = Array.from(presentSet);
  analysis.keywordsMissing = missingList;

  // Recalculate keyword breakdown score if false-negatives were fixed
  if (analysis.scoreBreakdown && typeof analysis.scoreBreakdown.keywords === "number") {
    const totalKeywords = analysis.keywordsPresent.length + analysis.keywordsMissing.length;
    if (totalKeywords > 0) {
      const accurateRatio = analysis.keywordsPresent.length / totalKeywords;
      const accurateKeywordScore = Math.min(25, Math.max(5, Math.round(accurateRatio * 25)));
      if (accurateKeywordScore > analysis.scoreBreakdown.keywords) {
        const diff = accurateKeywordScore - analysis.scoreBreakdown.keywords;
        analysis.scoreBreakdown.keywords = accurateKeywordScore;
        if (typeof analysis.atsScore === "number") {
          analysis.atsScore = Math.min(
            100,
            Math.round(
              analysis.scoreBreakdown.keywords +
                (analysis.scoreBreakdown.formatting || 0) +
                (analysis.scoreBreakdown.impact || 0) +
                (analysis.scoreBreakdown.clarity || 0)
            )
          );
        }
      }
    }
  }

  return analysis;
}

function buildPrompt({ rawText, targetRole }) {
  return [
    "You are a senior technical recruiter and ATS (Applicant Tracking System) expert reviewing a resume.",
    targetRole
      ? `Target role: ${targetRole}.`
      : "No specific target role was provided - assess for the role the candidate appears to be aiming for.",
    "",
    "CRITICAL KEYWORD EXTRACTION RULES:",
    "1. 'keywordsPresent':",
    "   - MUST include ALL technical skills, programming languages, frameworks, libraries, databases, and methodologies mentioned ANYWHERE in the resume text (including Skills section, 'Additional Technology Exposure', Projects, Tools, Education, and Work Experience).",
    "   - If a technology like MongoDB, Express.js, Node.js, JavaScript, or Agile is written anywhere in the resume, it is STRICTLY MANDATORY to put it in 'keywordsPresent'.",
    "2. 'keywordsMissing':",
    "   - List ONLY notable keywords/skills for the target role that are 100% COMPLETELY ABSENT from the entire resume text.",
    "   - NEVER put a skill in 'keywordsMissing' if the candidate has written it in their resume text.",
    "",
    "SCORING & FEEDBACK RULES:",
    "- Score the resume from 0-100 based on ATS readiness (keyword match, parseable formatting, quantified impact, clarity).",
    "- Return exactly 5 prioritized issues, 5 standout strengths and 5-10 weak bullets rewritten to be stronger, quantified, and ATS-friendly.",
    "- Rewrites must preserve the original meaning. Each rewrite needs a one-line rationale.",
    "- Be specific and evidence-based - cite phrasing from the resume in explanations.",
    "",
    "RESUME TEXT:",
    "__________",
    rawText,
    "__________",
  ].join("\n");
}

async function callGemini(prompt) {
  const result = await ai.models.generateContent({
    model: env.geminiModel,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.4,
    },
  });

  const text =
    typeof result.text === "function" ? result.text() : result.text;

  if (!text) throw new Error("Empty response from Gemini");

  return {
    text,
    usage: result.usageMetadata || {},
  };
}

async function analyzeResume({ rawText, targetRole }) {
  if (!ai) {
    throw ApiError.internal(
      "GEMINI_API_KEY is not configured on the server."
    );
  }

  const prompt = buildPrompt({ rawText, targetRole });

  let lastErr;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { text, usage } = await callGemini(prompt);
      const parsed = JSON.parse(text);
      const validated = analysisValidator.parse(parsed);
      const reconciled = reconcileKeywords(rawText, validated);

      return {
        analysis: reconciled,
        model: env.geminiModel,
        promptTokens: usage.promptTokenCount,
        responseTokens: usage.candidatesTokenCount,
      };
    } catch (err) {
      lastErr = err;
      if (attempt === 2) break;
    }
  }

  throw ApiError.internal(
    `Gemini analysis failed: ${lastErr?.message || "unknown error"}`
  );
}

module.exports = { analyzeResume, reconcileKeywords, isKeywordInText };
