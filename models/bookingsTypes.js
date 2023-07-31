const mongoose = require("mongoose");

const BookingsTypeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    url: { type: String },
    description: { type: String },
    duration: { type: String },
    location: { type: String },
    padding: { type: String },
    days_ahead: { type: String },
    currentTime: { type: String },
    available: [
      {
        id: { type: String },
        day: { type: String },
        availableSlots: [
          {
            start: { type: String },
            end: { type: String },
          },
        ],
        enable: { type: Boolean },
      },
    ],
    question: [
      {
        answer: { type: String },
        question: { type: String },
        required: { type: Boolean },
      },
    ],
    enableBookings: { type: Boolean },
    charge: { type: String, require: [true] },
    private: { type: String, require: [true] },
    days: { type: String },
    time: { type: String },
  },
  { timestamps: true }
);

const BookingsType = mongoose.model("BookingsType", BookingsTypeSchema);
module.exports = BookingsType;
