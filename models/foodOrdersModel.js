const mongoose = require("mongoose");

const foodOrdersSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    packs: {
      type: String,
    },
    price: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FoodOrders = mongoose.model("foodorders", foodOrdersSchema);

module.exports = FoodOrders;
