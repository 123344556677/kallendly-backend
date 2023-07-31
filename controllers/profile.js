const ProfileModel = require("../models/profile");
const userModel = require("../models/user");

const getProfile = async (req, res) => {
  ProfileModel.find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getProfileById = async (req, res) => {
  console.log(req.body);
  const response = userModel
    .findById(req.body.userId)
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })

    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
  console.log(response);
};

const addProfile = async (req, res) => {
  userModel
    .findById(req.body.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User Not found!",
        });
      }
      let profiles = new ProfileModel({
        userId: req.body.userId,
        ProfilePicture: req.body.ProfilePicture,
        Name: req.body.Name,
        PageLink: req.body.PageLink,
        email: req.body.email,
        TimeZone: req.body.TimeZone,
        TimeFormate: req.body.TimeFormate,
        Currency: req.body.Currency,
        BookingPageDescription: req.body.BookingPageDescription,
        AvailabilityInterval: req.body.AvailabilityInterval,
      });
      return profiles.save();
    })
    .then((data) => {
      return res.status(200).send({
        success: true,
        message: "Profile successfully added",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while sending Profile.",
      });
    });
};

const updateProfile = async (req, res) => {
  if (
    !req.body.Name ||
    !req.body.PageLink ||
    !req.body.email ||
    !req.body.TimeZone ||
    !req.body.TimeFormate ||
    !req.body.Currency ||
    !req.body.BookingPageDescription ||
    !req.body.AvailabilityInterval
  ) {
    return res.status(400).send({
      success: false,
      message: "Please enter Profile data",
    });
  }

  ProfileModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Profile not found with id " + req.params.id,
        });
      }
      res.send({
        success: true,
        data: data,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Profile not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating Profile with id " + req.params.id,
      });
    });
};

const updateProfileById = async (req, res) => {
  console.log(req.body, "======>profile");
  try {
    userModel.findByIdAndUpdate(
      {
        _id: req.body.userId,
      },

      {
        $set: {
          name: req.body.Name,
          email: req.body.email,
          img: req.body.ProfilePicture,
          TimeZone: req.body.TimeZone,
          availibilityInterval: req.body.AvailabilityInterval,
          description: req.body.BookingPageDescription,
          Currency: req.body.Currency,
          TimeFormate: req.body.TimeFormate,
          PageLink: req.body.PageLink,
        },
      },
      async (err, data) => {
        if (data) {
          return res.status(200).send({
            success: true,
            message: "Profile successfully updated",
            data: data,
          });
        } else {
          return res.status(400).send({ message: "Error in updating profile" });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({ message: "Error in updating profile", err });
  }
};

const deleteProfile = async (req, res) => {
  ProfileModel.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Profile not found with id " + req.params.id,
        });
      }
      res.json({
        success: true,
        message: "Profile successfully deleted!",
        data: data,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "Booking not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete Profile with id " + req.params.id,
      });
    });
};

module.exports = {
  getProfile,
  addProfile,
  updateProfile,
  deleteProfile,
  getProfileById,
  updateProfileById,
};
