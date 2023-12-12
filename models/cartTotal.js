const mongoose = require("mongoose");

const CartTotalSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    total: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CartTotal = mongoose.model("carttotal", CartTotalSchema);

module.exports = CartTotal;
