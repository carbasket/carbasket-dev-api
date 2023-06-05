const productModel = require("../models/product.model");
const logger = require("../utils/log");
const AppError = require("../utils/error/appError");
const imgUpload = require("../middleware/uploadFile");
const slackNotification = require("./sms/support").sendSlackNotification;

module.exports.createRecord = async (payload) => {
  const record = await productModel.create(payload);
  return record;
};

module.exports.findProductRecord = async (condition, populateQuery) => {
  const record = await productModel.findOne(condition).populate(populateQuery);
  return record;
};

module.exports.findAllProductRecords = async (condition, populateQuery) => {
  const record = await productModel.find(condition).populate(populateQuery);
  return record;
};

module.exports.updateRecord = async (condition, updateQuery) => {
  const option = { new: true };
  const record = await productModel.findByIdAndUpdate(
    condition,
    updateQuery,
    option
  );
  return record;
};

// create product by guest-user{evalution method!}

module.exports.createProductByGuest = async (body, query) => {
  logger.info("creating product");
  if (!body.brandName || !body.location || !body.price) {
    throw new AppError(401, "product", "P_E001", "messing-fileds");
  }
  const count = await this.getAllProducts({
    createdBy: body.userId,
  });

  logger.info(count.length);

  if (Array.isArray(body.vehiclePictures)) {
    let promises = [];
    for (let obj of body.vehiclePictures) {
      const d = { img: await imgUpload.uploadFile(obj.img, "vehicle") };
      const k = {
        img: d.img.Location,
      };
      console.log(k);
      promises.push(k);
    }
    console.log(promises);
    body.vehiclePictures = promises;
  }

  if (Array.isArray(body.rcPictures)) {
    let promises = [];
    for (let obj of body.rcPictures) {
      const d = { img: await imgUpload.uploadFile(obj.img, "RC") };
      const k = {
        img: d.img.Location,
      };
      console.log(k);
      promises.push(k);
    }
    console.log(promises);
    body.rcPictures = promises;
  }

  const payload = {
    description: body.description,
    vehicleType: body.vehicleType,
    brandName: body.brandName,
    modelName: body.modelName,
    fuleWhellType: body.fuleWhellType,
    manufactureYear: body.manufactureYear,
    location: body.location,
    condition: body.condition,
    vehiclePictures: body.vehiclePictures,
    rcPictures: body.rcPictures,
    price: body.price,
    createdBy: body.userId,
    updatedBy: body.userId,
  };
  const record = await this.createRecord(payload);
  const condition = {
    _id: record._id,
  };
  const updateData = { $inc: { guestUserCount: count.length } };
  const updateProduct = await this.updateRecord(condition, updateData);
  slackNotification(updateProduct);
  return updateProduct;
};

// get all products for admin
module.exports.getAllProducts = async (condition, query) => {
  logger.info("get all product");
  const populateQuery = [
    { path: "createdBy", select: ["_id", "username", "email", "phoneNumber"] },
  ];
  const record = await this.findAllProductRecords(condition, populateQuery);
  return record;
};

// getCurrentUserProducts
module.exports.getCurrentUserProducts = async (loggInUser, body) => {
  logger.info("Get current user product");
  const populateQuery = [
    { path: "createdBy", select: ["_id", "username", "email", "phoneNumber"] },
  ];
  const condition = {
    createdBy: loggInUser._id,
  };
  const record = await this.findAllProductRecords(condition, populateQuery);
  return record;
};

// update product
module.exports.updateProducts = async (productId, body) => {
  logger.info("update Product");
  const condition = {
    _id: productId,
  };
  const updateData = {
    ...body,
  };
  const record = await this.updateRecord(condition, updateData);
  return record;
};

// delete product
module.exports.deleteProducts = async (productId, body) => {
  logger.info("delete product");
  const condition = {
    _id: productId,
  };
  const record = await productModel.findOneAndDelete(condition);
  return true;
};
