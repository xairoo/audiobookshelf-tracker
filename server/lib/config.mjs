import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

// Set console title
process.title = process.env.npm_package_name;

const requiredConfigVars = [
  "USERNAME",
  "PASSWORD",
  "JWT_SECRET",
  "ABS_URL",
  "ABS_TOKEN",
];

// // All required options set?
let hasMissingOptions = false;

for (const configVar of requiredConfigVars) {
  if (!process.env[configVar]) {
    hasMissingOptions = true;
    logger.error("Missing config option: " + configVar);
  }
}

// Stop if not all env vars are set
if (hasMissingOptions) {
  process.exit(1);
}

const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const SERVER_PORT = process.env.SERVER_PORT || 3005;

const ABS_URL = process.env.ABS_URL;
const ABS_TOKEN = process.env.ABS_TOKEN;

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_AUTH_TOKEN_LIFETIME = 3600;
const JWT_REFRESH_TOKEN_LIFETIME = 3600 * 24 * 7;

export default {
  CLIENT_PORT,
  SERVER_PORT,
  ABS_URL,
  ABS_TOKEN,
  USERNAME,
  PASSWORD,
  JWT_SECRET,
  JWT_AUTH_TOKEN_LIFETIME,
  JWT_REFRESH_TOKEN_LIFETIME,
};
