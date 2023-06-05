const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = require("./user.model");

const productSchema = new Schema(
  {
    description: { type: String },
    vehicleType: { type: String, required: true },
    brandName: { type: String, required: true },
    modelName: { type: String },
    fuleWhellType: { type: String },
    manufactureYear: { type: String, required: true },
    location: { type: String, required: true },
    condition: { type: String, required: true },
    vehiclePictures: [{ img: { type: String } }],
    rcPictures: [{ img: { type: String } }],
    price: { type: String },
    guestUserCount: { type: Number, required: true, default: 1 },
    adminSeen: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
