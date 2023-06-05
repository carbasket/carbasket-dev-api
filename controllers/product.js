const productService = require("../services/product");
const logger = require("../utils/log");
const responser = require("../utils/responser");

module.exports.createProductByGuest = async (req, res) => {
  logger.info("START:Guest user creating product started");
  const reqData = req.body;
  reqData.userId = req.userId;
  const query = req.query;
  const data = await productService.createProductByGuest(reqData, query);
  logger.info(data);
  return responser.send(200, "product", "P_S001", req, res, data);
};

module.exports.findAllProducts = async (req, res) => {
  logger.info("START:fetching product started");
  const reqData = req.body;
  const query = req.query;
  const data = await productService.getAllProducts({});
  logger.info(data);
  return responser.send(200, "product", "P_S002", req, res, data);
};

module.exports.getCurrentUserProducts = async (req, res) => {
  logger.info("START:fetching Current user product started");
  const loggInUser = req.user;
  const query = req.query;
  const data = await productService.getCurrentUserProducts(loggInUser, query);
  logger.info(data);
  return responser.send(200, "product", "P_S003", req, res, data);
};

module.exports.updateProducts = async (req, res) => {
  logger.info("START:update product started");
  const param = req.params;
  const reqData = req.body;
  const data = await productService.updateProducts(param.productId, reqData);
  logger.info(data);
  return responser.send(200, "product", "P_S004", req, res, data);
};

module.exports.deleteProducts = async (req, res) => {
  logger.info("START:delete product started");
  const param = req.params;
  const data = await productService.deleteProducts(param.productId);
  logger.info(data);
  return responser.send(200, "product", "P_S005", req, res, data);
};
