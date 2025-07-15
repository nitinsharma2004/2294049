require('../../logging-middleware/logger');

const customLoggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    await Log("backend", "info", "middleware", message);
  });

  next();
};

module.exports = { customLoggerMiddleware };
