const mongoose = require("mongoose");

const RazorSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: { type: String, required: true },
  amountPaid: { type: String },
});

const Razor = mongoose.model("Razor", RazorSchema);
module.exports = Razor;
