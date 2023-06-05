// Package Imports
const app = require("./app");

// Custom Imports
const config = require("./config/index");
const logger = require("./utils/log");

const server = app.listen(config.PORT, () => {
  logger.info(
    `App is running at http://localhost:${config.PORT}`,
    config.PORT,
    app.get("env")
  );
  logger.info(" Press CTRL-C to stop\n");
});

server.on("close", () => {
  logger.info("Server closed");
  server.close();
});

process.on("SIGINT", (err) => {
  server.emit("close");
  process.exit(0);
});

module.exports = server;
