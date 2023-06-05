const userModel = require("../models/user.model");
const logger = require("../utils/log");
const tokenService = require("../middleware/token");
const userService = require("./user");
const AppError = require("../utils/error/appError");
const { generateOTP } = require("../utils/utils");
const sms = require("./sms/fast2sms");
const { v4: uuidv4 } = require("uuid");

module.exports.createRecord = async (payload) => {
  const record = await userModel.create(payload);
  return record;
};

module.exports.updateRecord = async (condition, updateQuery) => {
  const option = { new: true };
  const record = await userModel.findOneAndUpdate(
    condition,
    updateQuery,
    option
  );
  return record;
};

module.exports.createRegister = async (body, query) => {
  logger.info("creating admin register");
  if (!body.phoneNumber) {
    throw new AppError(404, "auth", "A_E001");
  }
  const isPhoneNumberExists = await userService.findUser({
    phoneNumber: body.phoneNumber,
  });
  if (isPhoneNumberExists) {
    const resentOtp = await this.updateRecord(
      { _id: isPhoneNumberExists.id },
      { phoneOTP: generateOTP() }
    );
    await sms.smsOTPV2(resentOtp);
    logger.info(resentOtp);
    isPhoneNumberExists.phoneOTP = undefined;
    return isPhoneNumberExists;
  }
  const payload = {
    phoneNumber: body.phoneNumber,
    phoneOTP: generateOTP(),
  };
  logger.info(payload);
  const user = await this.createRecord(payload);
  await sms.smsOTPV2(user);
  user.phoneOTP = undefined;
  return user;
};

module.exports.authLogin = async (body, query) => {
  logger.info("login service Starting");
  if (!body.phoneNumber || !body.phoneOTP) {
    throw new AppError(404, "auth", "A_E009");
  }
  const filter = { phoneNumber: body.phoneNumber };
  const user = await userService.getOnlyUser(filter);
  logger.data("User info fetched", user);
  if (!user) {
    throw new AppError(404, "auth", "A_E012");
  }
  if (body.phoneOTP !== String(user.phoneOTP))
    throw new AppError(400, "product", "P_E003");

  const updateOtp = await this.updateRecord(
    { _id: user.id },
    { phoneOTP: null, phoneisVerified: true }
  );
  logger.info(updateOtp);
  const accessToken = tokenService.signToken(user._id, "access");
  let userObject = {
    token: accessToken,
    id: user._id,
    phoneNumber: user.phoneNumber,
    account: user.accountType,
  };
  return userObject;
};

module.exports.refreshOtp = async (body) => {
  logger.info("Refresh service Starting");
  const filter = { phoneNumber: body.phoneNumber };
  const user = await userService.getOnlyUser(filter);
  if (!user) {
    throw new AppError(404, "auth", "A_E012");
  }
  const record = await this.updateRecord(
    { _id: user.id },
    { phoneOTP: generateOTP() }
  );
  await sms.smsOTPV2(record);
  logger.info(record);
  record.phoneOTP = undefined;
  return record;
};
