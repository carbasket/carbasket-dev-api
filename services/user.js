const userModel = require("../models/user.model");
const logger = require("../utils/log");
const AppError = require("../utils/error/appError");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.createRecord = async (payload) => {
  const record = await userModel.create(payload);
  return record;
};

//for validation
module.exports.findUser = async (condition, projection = {}) => {
  const user = await userModel.findOne(condition, projection);
  return user;
};

//for login
module.exports.getOnlyUser = async (condition) => {
  if (!condition.status) condition.status = { $ne: "deleted" };
  const user = await userModel.findOne(condition).select("+password");
  return user;
};

module.exports.updateRecord = async (condition, updateQuery) => {
  const option = { new: true };
  const record = await userModel.findOneAndUpdate(
    { _id: condition },
    updateQuery,
    option
  );
  return record;
};

//get user profile
module.exports.profile = async (userId, query) => {
  logger.info("START:profile user");
  const condition = {
    _id: ObjectId(userId),
  };
  const record = await this.getOnlyUser(condition);
  record.password = undefined;
  record.phoneOTP = undefined;
  return record;
};

// get all user
module.exports.findAllUser = async (body, query) => {
  logger.info("START:find all user");
  const condition = {
    accountType: "user",
  };
  const record = await userModel
    .find(condition)
    .select("-__v -phoneOTP -password");
  return record;
};
