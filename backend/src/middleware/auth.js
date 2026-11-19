const env = require("../config/env");
const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = req.cookies[env.cookieName] || bearerToken;
    if (!token) return next(ApiError.unauthorized());

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw ApiError.unauthorized("Session no longer valid");

    req.user = user;
    next();
  } catch (err) {
    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return next(ApiError.unauthorized("Invalid or expired session"));
    }
    next(err);
  }
}

module.exports = { requireAuth };