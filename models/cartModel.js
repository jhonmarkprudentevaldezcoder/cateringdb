const mongoose = require("mongoose");

const foodCartSchema = mongoose.Schema(
  {
    reservationId: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const FoodCart = mongoose.model("cart", foodCartSchema);

module.exports = FoodCart;
