const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

const isHttpsOrProd =
  env.isProd ||
  Boolean(process.env.RENDER) ||
  process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isHttpsOrProd,
  sameSite: isHttpsOrProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

module.exports = { signToken, verifyToken, cookieOptions };