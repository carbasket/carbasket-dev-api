const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/admin");
const authorized = require("../middleware/verify");
const catchError = require("../utils/error/catchError");

adminRouter.post("/register", catchError(adminController.createAdmin));
adminRouter.post("/login", catchError(adminController.adminlogin));

adminRouter.use(authorized.verifyToken);

adminRouter
  .route("/seen/:productId")
  .patch(
    authorized.restrictTo("admin"),
    catchError(adminController.seenProductByadmin)
  );

adminRouter
  .route("/product/:productId")
  .patch(
    authorized.restrictTo("admin"),
    catchError(adminController.teleCallerByAdmin)
  );
adminRouter
  .route("/product")
  .get(
    authorized.restrictTo("admin"),
    catchError(adminController.getTeleCallersWithPagination)
  );

module.exports = adminRouter;
