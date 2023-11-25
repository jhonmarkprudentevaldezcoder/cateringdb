const mongoose = require("mongoose");

const foodOrdersSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    userId: {
      type: String,
    },
    pax: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FoodOrders = mongoose.model("foodorders", foodOrdersSchema);

module.exports = FoodOrders;
