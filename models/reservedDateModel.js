const mongoose = require("mongoose");

const reservedDateSchema = mongoose.Schema(
  {
    themeId: {
      type: String,
    },
    date: {
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

const ReservedDates = mongoose.model("ReservedDate", reservedDateSchema);

module.exports = ReservedDates;
