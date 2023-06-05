const mongoose = require("mongoose");
const logger = require("./log");
const config = require("../config/index");
mongoose.set("strictQuery", true);

logger.info("Connecting to Database...");
module.exports.openDBConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const connection = await mongoose.connect(config.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      // mongoose.set('strictQuery', true);
      logger.info("Connected to MongoDB DataBase");
      return connection;
    } catch (err) {
      logger.error(
        "MongoDB connection error. Please make sure MongoDB is running. "
      );
      throw new Error(err);
    }
  }
};

module.exports.closeDBConnection = async (db) => {
  if (db) {
    await db.disconnect();
    logger.info("Connection closed");
  }
};
