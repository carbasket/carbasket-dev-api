const logger = require("../utils/log");
const tokenService = require("../middleware/token");
const userService = require("./user");
const productService = require("./product");
const AppError = require("../utils/error/appError");
const bcrypt = require("bcryptjs");

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
