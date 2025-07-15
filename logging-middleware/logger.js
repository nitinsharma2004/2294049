const axios = require("axios");

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

/**
 * Sends a log event to the Affordmed logging endpoint
 * @param {string} stack - "backend" | "frontend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - One of the allowed package names
 * @param {string} message - Descriptive message
 */
async function Log(stack, level, pkg, message) {
  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message
  };

  try {
    await axios.post(LOG_API_URL, payload);
    console.log(`[Logged] ${stack.toUpperCase()} - ${level.toUpperCase()} - ${pkg}: ${message}`);
  } catch (error) {
    console.error("[Log Error]", error.message);
  }
}

module.exports = {
  Log
};
