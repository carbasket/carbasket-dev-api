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
  const data = await adminService.seenProductByadmin(
    req.params.productId,
    reqData
  );
  logger.info(data);
  return responser.send(200, "admin", "A_S003", req, res, data);
};

module.exports.teleCallerByAdmin = async (req, res) => {
  logger.info("START:tele Caller controller");
  const reqData = req.body;
  reqData.userId = req.userId;
  const data = await adminService.teleCallerByAdmin(
    req.params.productId,
    reqData
  );
  logger.info(data);
  return responser.send(200, "admin", "A_S004", req, res, data);
};

module.exports.getTeleCallersWithPagination = async (req, res) => {
  logger.info("START:seen controller");
  const reqQuery = req.query;
  const data = await adminService.getTeleCallersWithPagination(reqQuery);
  logger.info(data);
  return responser.send(
    200,
    "admin",
    `Successfully ${reqQuery.type} Fetched`,
    req,
    res,
    data
  );
};
