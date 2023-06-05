const adminService = require("../services/admin");
const logger = require("../utils/log");
const responser = require("../utils/responser");

module.exports.createAdmin = async (req, res) => {
  logger.info("START:Auth register controller");
  const reqData = req.body;
  logger.data("qwwwwwwww", reqData);
  const data = await adminService.createAdminRegister(reqData);
  logger.info(data);
  return responser.send(200, "admin", "A_S001", req, res, data);
};

module.exports.adminlogin = async (req, res) => {
  logger.info("START:Auth Login controller");
  const reqData = req.body;
  const queryData = req.query;
  const data = await adminService.adminLogin(reqData, queryData);
  logger.info(data);
  return responser.send(200, "admin", "A_S002", req, res, data);
};

module.exports.seenProductByadmin = async (req, res) => {
  logger.info("START:seen controller");
  const reqData = req.body;
  const data = await adminService.seenProductByadmin(req.params.productId, reqData);
  logger.info(data);
  return responser.send(200, "admin", "A_S003", req, res, data);
};
