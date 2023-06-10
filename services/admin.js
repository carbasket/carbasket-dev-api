const logger = require("../utils/log");
const tokenService = require("../middleware/token");
const userService = require("./user");
const productService = require("./product");
const productModel = require("../models/product.model");
const AppError = require("../utils/error/appError");
const bcrypt = require("bcryptjs");
const { round } = require("lodash");

module.exports.createAdminRegister = async (body, query) => {
  logger.info("creating admin register");

  if (!body.email || !body.username || !body.phoneNumber) {
    throw new AppError(404, "auth", "A_E001");
  }
  const isPhoneNumberExists = await userService.findUser({
    phoneNumber: body.phoneNumber,
  });
  if (isPhoneNumberExists) {
    throw new AppError(404, "auth", "A_E005");
  }
  const password = bcrypt.hashSync(body.password);
  const payload = {
    username: body.username,
    email: body.email,
    phoneNumber: body.phoneNumber,
    phoneOTP: undefined,
    phoneisVerified: true,
    password: password,
    accountType: "admin",
  };
  logger.info(payload);
  const user = await userService.createRecord(payload);
  user.password = undefined;
  return user;
};

module.exports.adminLogin = async (body, query) => {
  logger.info("admin login Starting");
  if (!body.phoneNumber || !body.password) {
    throw new AppError(404, "auth", "A_E010");
  }
  const filter = { phoneNumber: body.phoneNumber };
  const user = await userService.getOnlyUser(filter);
  logger.data("User info fetched", user);
  if (!user) {
    throw new AppError(404, "auth", "A_E012");
  }
  if (!(await bcrypt.compare(body.password, user.password))) {
    throw new AppError(400, "auth", "A_E011");
  }
  const accessToken = tokenService.signToken(user._id, "access");
  let userObject = {
    token: accessToken,
    id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    accountType: user.accountType,
  };
  return userObject;
};

// view or seen by admin
module.exports.seenProductByadmin = async (productId, body) => {
  logger.info("admin seen Starting");
  const condition = {
    _id: productId,
  };
  const updateData = {
    adminSeen: body.adminSeen,
  };
  const record = await productService.updateRecord(condition, updateData);
  return record;
};

// update product by telecaller
module.exports.teleCallerByAdmin = async (productId, body) => {
  logger.info("START: tele Caller Starting");
  const condition = {
    _id: productId,
  };
  const updateData = {
    teleCaller: body.teleCaller,
    updatedBy: body.userId,
  };
  const record = await productService.updateRecord(condition, updateData);
  return record;
};

module.exports.getTeleCallersWithPagination = async (query) => {
  logger.info("START: Get TeleCaller with pagination func");
  const pageNo = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 0;
  let page = pageNo || 1;
  let size = pageSize || 100;
  let skip = page > 1 ? (page - 1) * size : 0;
  logger.info(`pageNo = ${page} & size = ${size} & skip = ${skip}`);

  const conditions = {
    teleCaller: query.type,
  };

  logger.info(conditions);
  const data = await productModel
    .find(conditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size);

  const total = await productModel.find(conditions);
  const totalDocs = total.length;
  const totalPages = round(total.length / size);
  const prevPage = page - 1 === 0 ? null : page - 1;
  const nextPage = page + 1 >= totalPages ? null : page + 1;

  return {
    docs: data,
    totalDocs,
    limit: size,
    totalPages,
    page,
    pagingCounter: (page - 1) * size + 1,
    hasPrevPage: !(prevPage === null),
    hasNextPage: !(nextPage === null),
    prevPage,
    nextPage,
  };
};
