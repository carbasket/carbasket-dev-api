const jwt = require("jsonwebtoken");
const config = require("../config/index");

module.exports.signToken = (id, type) => {
  let secret;
  let tokenValidity;
  switch (type) {
    case "access":
      secret = config.JWT_SECRET;
      tokenValidity = config.ACCESS_TOKEN_VALIDITY;
      break;
    case "refresh":
      secret = config.JWT_SECRET;
      tokenValidity = config.REFRESH_TOKEN_VALIDITY;
      break;
    default:
      throw new Error("Invalid Access Token Type");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: tokenValidity,
  });
};
