const config = require("../../config/index");
const axios = require("axios");
const logger = require("../../utils/log");

const sendSlackNotification = (payload) => {
  const hook = config.SLACK;

  if (hook == "" || hook == null) return;
  const finalPayload = {
    text: JSON.stringify(payload, null, 4),
  };
  axios
    .post(hook, finalPayload)
    .then((res) => {
      logger.data("Slack Notification sent Success.");
    })
    .catch((err) => {
      const status = err && err.response && err.response.status;
      const statusText = err && err.response && err.response.statusText;
      logger.error("Slack notification send error", status, statusText);
    });
};

module.exports.sendSlackNotification = sendSlackNotification;
