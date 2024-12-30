import { config, logger } from "./index.mjs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "../routes/index.mjs";

const app = express();

// Enable CORS
var corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(cookieParser());

// Apply all routes
routes(app);

// Finally start the server
export const server = app.listen(config.SERVER_PORT, () => {
  logger.info(`API is up and listening on port ${config.SERVER_PORT}`);
});
