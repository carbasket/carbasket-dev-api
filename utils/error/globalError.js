// Package Imports

// Custom Imports
const responser = require("../responser");
const logger = require("../log");

const sendError = (err, req, res) => {
  if (err.isOperational) {
    return responser.send(
      err.statusCode,
      err.handler,
      err.messageCode,
      req,
      res,
      err
    );
  } else {
    logger.error("ERROR 💥", err);
    return responser.send(500, "global", "G_E001", req, res, err);
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = err;
  sendError(error, req, res);
};
