const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    img: {
      type: String,
    },
    email: {
      type: String,
      require: [true, "Please enter your Email"],
    },
    password: {
      type: String,
      require: [true, "please enter your Password"],
    },
    TimeZone: {
      type: String,
    },
    TimeFormate: {
      type: String,
    },
    Currency: {
      type: String,
    },
    description: {
      type: String,
    },
    PageLink: {
      type: String,
    },
    userRole: { type: String },
    isPremium: { type: Boolean, require: [true, "account is premium or not"] },
    planStartDate: { type: String },
    planEndDate: { type: String },
    planType: { type: String },
    planStatus: { type: String },
    availibilityInterval: {
      type: String,
    },
    loggedInWithGoogle: {
      type: Boolean,
      require: [true, "please enter your Password"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
