// Package Imports

// Custom Imports
const messageCode = require("../error-code/index");
const logger = require("./log");

module.exports.isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};
const getMessage = (handler, locale, code) => {
  return messageCode[handler][locale][code];
};
module.exports.isStatusCode = (statusCode) => {
  return this.isNumeric(statusCode) && statusCode >= 100 && statusCode < 600;
};
const successResponse = (handler, messageCode, req, data, success) => {
  let responseData = {
    status: "success",
    message: getMessage(handler, "en", messageCode),
    messageCode,
    success,
    data,
  };
  if (Array.isArray(data)) responseData.totals = { count: data.length };
  logger.info(`Success || ${messageCode} || ${handler} || ${req.originalUrl}`);
  return responseData;
};

const errorResponse = (handler, messageCode, req, error) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  // Response Data for the client request
  let response = {
    status: "error",
    message: messageCode
      ? getMessage(handler, "en", messageCode)
      : "Unknown Error",
    messageCode,
  };
  if (error.isOperational) {
    // If mergeOptional is true, then merge translated error Message and Optional Parameters
    if (error.mergeOptional) {
      response.message = response.message + " : " + error.optionalMessage;
    } else {
      response.errorDetails = error.optionalMessage;
    }
  }
  // If message is dynamic (for refund message) in error response for Maxis
  if (error.dynamicMessage) {
    response.message = error.dynamicMessage;
    response.errorDetails = error.data;
  }
  logger.data("Error", response);
  return response;
};
module.exports.send = (
  statusCode,
  handler,
  messageCode,
  req,
  res,
  data,
  success = true
) => {
  let responseData;
  statusCode = this.isStatusCode(statusCode) ? statusCode : 500;
  if (`${statusCode}`.startsWith("2"))
    responseData = successResponse(handler, messageCode, req, data, success);
  if (`${statusCode}`.startsWith("4") || `${statusCode}`.startsWith("5"))
    responseData = errorResponse(handler, messageCode, req, data);
  res.status(statusCode).send(responseData);
};
