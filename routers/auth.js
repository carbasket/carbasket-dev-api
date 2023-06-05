const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth");
const authorized = require("../middleware/verify");
const catchError = require("../utils/error/catchError");

authRouter.post("/register", catchError(authController.createAuth));
authRouter.post("/login", catchError(authController.login));
authRouter.post("/refresh-otp", catchError(authController.refreshOtp));

module.exports = authRouter;
