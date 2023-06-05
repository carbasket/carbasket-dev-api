const logger = require("../../utils/log");
const axios = require("axios");
const config = require("../../config/index");

module.exports.smsOTPV2 = async (payload) => {
  logger.info(payload.phoneOTP);
  const data = {
    variables_values: payload.phoneOTP,
    route: "otp",
    numbers: payload.phoneNumber,
  };

  const configData = {
    method: "post",
    url: config.FAST2SMS,
    headers: {
      authorization: config.SMS_API_KEY,
    },
    data: data,
  };
  const response = await axios(configData);
  logger.data("axios", response.data);
  return response;
};
