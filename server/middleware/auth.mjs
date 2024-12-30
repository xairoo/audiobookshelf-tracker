import jwt from "jsonwebtoken";
import { config } from "../lib/index.mjs";

/**
 * Check JWT token and return the payload
 * End request if failing
 * @return {Object} - JWT payload
 */
async function requireAuth(req, res, next) {
  // Gather the jwt token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If there isn't any token
  if (!token) {
    return res
      .status(401)
      .json({ error: "Authorization missing", code: 10120 });
  }

  try {
    res.locals.jwt = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Authorization failed", code: 10121 });
  }

  try {
    // Check the token data
    if (
      !res.locals.jwt ||
      !res.locals.jwt.iat ||
      !res.locals.jwt.exp ||
      !res.locals.jwt.username
    ) {
      return res
        .status(401)
        .json({ error: "Authorization failed", code: 10122 });
    }

    // Issued at okay?
    if (
      res.locals.jwt.iat <
      Math.floor(Date.now() / 1000) - config.JWT_AUTH_TOKEN_LIFETIME
    ) {
      return res
        .status(401)
        .json({ error: "Authorization expired", code: 10125 });
    }

    // Expired?
    if (res.locals.jwt.exp < Math.floor(Date.now() / 1000)) {
      return res
        .status(401)
        .json({ error: "Authorization expired", code: 10123 });
    }

    // Valid token data
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Authorization failed", code: 10124 });
  }
}

export { requireAuth };
