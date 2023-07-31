const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ProfilePicture: {
      type: String,
    },
    Name: {
      type: String,
      required: [true, "please enter your name"],
    },
    PageLink: {
      type: String,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      require: [true, "Please enter your Email"],
    },
    TimeZone: {
      type: String,
      
    },
    TimeFormate: {
      type: String,
      
    },
    PageLink: {
      type: String,
      
    },
    Currency: {
      type: String,
      
    },
    BookingPageDescription: {
      type: String,
      
    },
    AvailabilityInterval: {
      type: String,
     
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
