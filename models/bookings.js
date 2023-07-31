const mongoose = require("mongoose");

const BookingsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingsTypeId: {
      type: mongoose.Types.ObjectId,
      ref: "BookingsType",
      required: true,
    },
    eventId: {
      type: String,
    },
    addAttendees: [
      {
        name: { type: String },
        email: { type: String },
      },
    ],
    duration: { type: String },
    location: { type: String },
    days_ahead: { type: String },
    currentTime: { type: String },
    status: { type: String },
    with: { type: String, require: [true, "please enter your answer"] },
    time: { type: String, require: [true, "please select time"] },
  },
  { timestamps: true }
);

const Bookings = mongoose.model("Bookings", BookingsSchema);
module.exports = Bookings;
