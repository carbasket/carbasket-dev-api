const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user");
const authorized = require("../middleware/verify");
const catchError = require("../utils/error/catchError");

userRouter.use(authorized.verifyToken);

userRouter
  .route("/")
  .get(authorized.restrictTo("admin"), catchError(userController.getAllUser));

userRouter.route("/profile/:id").get(catchError(userController.getProfile));

module.exports = userRouter;
