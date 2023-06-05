const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new Schema(
  {
    username: { type: String },
    email: { type: String, lowercase: true },
    phoneNumber: { type: String },
    phoneisVerified: { type: Boolean, default: false },
    phoneOTP: { type: Number },
    accountType: { type: String, default: "user", enum: ["user", "admin"] },
    password: { type: String },
    createdBy: { type: String, required: true, default: "system" },
    updatedBy: { type: String, required: true, default: "system" },
  },
  { timestamps: true }
);

userSchema.plugin(paginate);
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("user", userSchema);
