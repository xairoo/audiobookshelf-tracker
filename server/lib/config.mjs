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
