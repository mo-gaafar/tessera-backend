// utils/logger.js
const winston = require("winston");

const customFormat = winston.format.printf(
  ({ timestamp, level, message, ...rest }) => {
    const levelString = `[${level.toUpperCase()}]`.padEnd(9);
    const restString = Object.keys(rest).length ? JSON.stringify(rest) : "";
    return `${timestamp} ${levelString} ${message} ${restString}`;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "your-service-name" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        customFormat
      ),
    })
  );
}

module.exports = logger;
