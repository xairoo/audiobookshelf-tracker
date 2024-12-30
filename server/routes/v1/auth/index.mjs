import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const authTokenLifetime = 3600;
const refreshTokenLifetime = 3600 * 24 * 7;

/**
 * Validation
 */
import Joi from "joi";
import { validateBody } from "../../../middleware/validation.mjs";

const body_schema = Joi.object({
  username: Joi.string().min(2).required(),
  password: Joi.string().min(8).required(),
});

// Login route
router.post("/login", validateBody(body_schema), async function (req, res) {
  const { body } = req;

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (body.username !== username) {
    return res.status(401).json({});
  }

  if (body.password !== password) {
    return res.status(401).json({});
  }

  const authTokenExp = Math.floor(Date.now() / 1000) + authTokenLifetime;
  const refreshTokenExp = Math.floor(Date.now() / 1000) + refreshTokenLifetime;

  const authToken = jwt.sign(
    { exp: authTokenExp, username: body.username },
    process.env.JWT_SECRET
  );

  const refreshToken = jwt.sign(
    {
      exp: refreshTokenExp,
      refresh_token: uuidv4(),
      username: body.username,
    },
    process.env.JWT_SECRET
  );

  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  res.setHeader("Authorization", "Bearer " + authToken);
  res.cookie("refresh_token", refreshToken, {
    path: "/",
    maxAge: refreshTokenLifetime * 1000,
    httpOnly: true, // You can't access these tokens in the client's javascript
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production" ? true : false, // Forces to use https in production
  });

  res.status(200).json({});
});

// Logout route
router.get("/logout", function (req, res) {
  res.clearCookie("refresh_token", { path: "/" });
  res.status(200).json({ message: "Bye bye..." });
});

// Refresh route
router.get("/refresh", async function (req, res) {
  if (!req.cookies || !req.cookies.refresh_token) {
    res.status(401).json({ error: "Missing refresh token" });
    return;
  }

  try {
    const decoded = jwt.verify(
      req.cookies.refresh_token,
      process.env.JWT_SECRET
    );

    const authTokenExp = Math.floor(Date.now() / 1000) + authTokenLifetime;
    const refreshTokenExp =
      Math.floor(Date.now() / 1000) + refreshTokenLifetime;

    const authToken = jwt.sign(
      { exp: authTokenExp, username: decoded.username },
      process.env.JWT_SECRET
    );

    const refreshToken = jwt.sign(
      {
        exp: refreshTokenExp,
        refresh_token: uuidv4(),
        username: decoded.username,
      },
      process.env.JWT_SECRET
    );

    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.setHeader("Authorization", "Bearer " + authToken);
    res.cookie("refresh_token", refreshToken, {
      path: "/",
      maxAge: refreshTokenLifetime * 1000,
      httpOnly: true, // You can't access these tokens in the client's javascript
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production" ? true : false, // Forces to use https in production
    });

    res.status(200).json({});
  } catch (err) {
    res.status(401).json({});
  }
});

export default router;
