const adminRouter = require("./admin");
const authRouter = require("./auth");
const userRouter = require("./user");
const productRouter = require("./product");

const routes = (app) => {
  app.use("/admin", adminRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/product", productRouter);
};

module.exports = routes;
