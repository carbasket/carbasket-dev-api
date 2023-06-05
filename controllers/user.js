const userService = require("../services/user");
const logger = require("../utils/log");
const responser = require("../utils/responser");

module.exports.getProfile = async (req, res, next) => {
  logger.info("START: Get User");
  const data = await userService.profile(req.params.id);
  logger.info(data);
  return responser.send(200, "user", "U_S002", req, res, data);
};

module.exports.getAllUser = async (req, res) => {
  logger.data("res==",res.statusCode)
  logger.info("Start user fetching");
  const data = await userService.findAllUser();
  logger.info(data);
  return responser.send(200, "user", "U_S003", req, res, data);
};