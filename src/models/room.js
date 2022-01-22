const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
var mongooseDelete = require("mongoose-delete");
const Room = new Schema(
  {
    admin_room: { type: String, maxLength: 255 },
    name_room: { type: String, maxLength: 655 },

    link_random: { type: String, slug: "name_room", unique: true },
  },
  {
    timestamps: true,
  }
);
Room.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
module.exports = mongoose.model("Room", Room);
