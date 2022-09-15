const mongoose = require("mongoose");

const coreList = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    domain: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("allowedDomains", coreList);
