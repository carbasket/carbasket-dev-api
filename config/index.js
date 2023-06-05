module.exports = {
  PORT: process.env.PORT || 4000,
  DB_CONNECTIONS: "mongodb://localhost:27017/lamda",
  DB_CONNECTION:
    "mongodb+srv://zulukk:zulukk@cluster0.nc9dbae.mongodb.net/zulukk?retryWrites=true&w=majority",
  OWNER_NAME: "Usman Pasha A",
  ACCESS_TOKEN_VALIDITY: 60 * 60,
  JWT_SECRET: "test",
  REFRESH_TOKEN_VALIDITY: "7d",
  GLOBAL_ACCESS_KEY_ID: "AKIAWBYDCJQGKZXY54UN",
  GLOBAL_SECRET_ACCESS_KEY: "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",
  GLOBAL_DEFAULT_REGION: "us-east-1",
  S3_IMAGE_BUCKET: "zulukk-images",
  S3_IMAGE_PATH: "ZULUKK-IMAGE",
  SMS_API_KEY:
    "fVWpFs80ZatOK4TkrmiCqHhbzndYNDv59LM1gG6lAjPSewo23Rxv4VP9MiC1pNGSwsLITOa5QeFy302D",
  FAST2SMS: "https://www.fast2sms.com/dev/bulkV2",
  SLACK:"https://hooks.slack.com/services/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"
};
