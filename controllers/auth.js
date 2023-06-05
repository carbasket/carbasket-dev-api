const authService = require("../services/auth");
const logger = require("../utils/log");
const responser = require("../utils/responser");

module.exports.createAuth = async (req, res) => {
  logger.info("START:Auth register controller");
  const reqData = req.body;
  logger.data("qwwwwwwww", reqData);
  const queryData = req.query;
  const data = await authService.createRegister(reqData, queryData);
  logger.info(data);
  return responser.send(200, "auth", "A_S001", req, res, data);
};

module.exports.login = async (req, res) => {
  logger.info("START:Auth Login controller");
  const reqData = req.body;
  const queryData = req.query;
  const data = await authService.authLogin(reqData, queryData);
  logger.info(data);
  return responser.send(200, "auth", "A_S002", req, res, data);
};

module.exports.refreshOtp = async (req, res) => {
  logger.info("START:Auth refresh OTP controller");
  const reqData = req.body;
  logger.data("qwwwwwwww", reqData);
  const queryData = req.query;
  const data = await authService.refreshOtp(reqData, queryData);
  logger.info(data);
  return responser.send(200, "auth", "A_S003", req, res, data);
};