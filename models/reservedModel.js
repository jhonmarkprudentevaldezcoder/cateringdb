const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    event: {
      type: String,
    },
    theme: {
      type: String,
    },

    orderid: {
      type: String,
    },
    venue: {
      type: String,
    },
    reservationDate: {
      type: String,
    },
    reservationTime: {
      type: String,
    },
    pax: {
      type: String,
    },
    reservationFee: {
      type: String,
    },
    total: {
      type: String,
    },
    balance: {
      type: String,
    },
    customer: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = Reservation;
