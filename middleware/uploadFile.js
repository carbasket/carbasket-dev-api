const AWS = require("aws-sdk");
const logger = require("../utils/log");
const config = require("../config/index");

AWS.config.update({
  accessKeyId: config.GLOBAL_ACCESS_KEY_ID,
  secretAccessKey: config.GLOBAL_SECRET_ACCESS_KEY,
  region: config.GLOBAL_DEFAULT_REGION,
});

const s3 = new AWS.S3();

module.exports.uploadFile = async (file, path) => {
  try {
    logger.info("image");
    const base64String = file;
    let base64Data;
    const type = base64String.split(";")[0].split("/")[1];
    logger.info(type);
    if (type == "mp4") {
      base64Data = new Buffer.from(
        base64String.replace(/^data:video\/mp4;base64,/, ""),
        "base64"
      );
    } else {
      base64Data = new Buffer.from(
        base64String.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
    }
    const params = {
      Bucket: config.S3_IMAGE_BUCKET,
      Key:
        `${config.S3_IMAGE_PATH}/${path}/` + new Date().getTime() + `.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentType: `*/*`,
    };
    return await s3.upload(params).promise();
  } catch (err) {
    logger.error(err.message, err);
    throw new Error(err.message);
  }
};

module.exports.getAllObject = async () => {
  try {
    let object = await s3
      .listObjectsV2({ Bucket: config.S3_IMAGE_BUCKET })
      .promise();
    const key = object.Contents.map((x) => x.Key);
    return key;
  } catch (err) {
    logger.error(err.message, err);
    throw new Error(err.message);
  }
};

module.exports.deleteOneObject = async (objectId) => {
  try {
    logger.info("deleting Object from S3 Bucket");
    const params = objectId;
    logger.info("params::" + params);
    let object = await s3
      .deleteObject({ Bucket: config.S3_IMAGE_BUCKET, Key: params })
      .promise();
    if (object) {
      return "Successfully Deleted!";
    } else {
      return "NOT Object From S3 Deleted!";
    }
  } catch (err) {
    logger.error(err.message, err);
    throw new Error(err.message);
  }
};
