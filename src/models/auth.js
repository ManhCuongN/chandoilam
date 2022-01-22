const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongooseDelete = require("mongoose-delete");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const User = new Schema(
  {
    fullname: { type: String, maxLength: 255 },
    email: { type: String, maxLength: 255 },
    password: { type: String, maxLength: 655 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    slug: { type: String, slug: "fullname", unique: true },
  },
  {
    timestamps: true,
  }
);
User.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
module.exports = mongoose.model("User", User);
