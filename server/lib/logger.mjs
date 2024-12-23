import pino from "pino";

const logger = pino({
  timestamp: process.env.NODE_ENV === "development" ? false : true,
  level: "info",
  // pino-pretty only for development
  // ...(process.env.NODE_ENV === "development" && {
  transport: {
    target: "pino-pretty",
    options: {
      ignore: "pid,hostname",
    },
  },
  // }),
});

export default logger;
