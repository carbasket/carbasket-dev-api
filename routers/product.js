const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product");
const authorized = require("../middleware/verify");
const catchError = require("../utils/error/catchError");

productRouter.use(authorized.verifyToken);

productRouter
  .route("/")
  .post(catchError(productController.createProductByGuest))
  .get(
    authorized.restrictTo("admin"),
    catchError(productController.findAllProducts)
  );

productRouter
  .route("/current")
  .get(catchError(productController.getCurrentUserProducts));
productRouter
  .route("/:productId")
  .delete(catchError(productController.deleteProducts))
  .patch(catchError(productController.updateProducts));

module.exports = productRouter;
