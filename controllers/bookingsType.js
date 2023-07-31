const BookingsTypeModel = require("../models/bookingsTypes");
const userModel = require("../models/user");

const getAllBookingsTypes = async (req, res) => {
  BookingsTypeModel.find()
    .then((data) => {
      return res.status(200).send({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getBookingsTypes = async (req, res) => {
  BookingsTypeModel.find({ userId: req.body.userId })
    .then((data) => {
      return res.status(200).send({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getBookingsTypesById = async (req, res) => {
  BookingsTypeModel.findById(req.params.id)
    .then((data) => {
      return res.status(200).send({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getBookingsTypesByIdAndSave = async (req, res) => {
  BookingsTypeModel.findById(req.params.id)
    .then((data) => {
      let BookingType = new BookingsTypeModel({
        userId: data.userId,
        title: data.title,
        url: data.url,
        description: data.description,
        duration: data.duration,
        location: data.location,
        padding: data.padding,
        days_ahead: data.days_ahead,
        currentTime: data.currentTime,
        available: data.available,
        question: data.question,
        enableBookings: data.enableBookings,
        charge: data.charge,
        private: data.charge,
        days: data.days,
        time: data.time,
      });
      BookingType.save();
      return res.status(200).send({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const addBookingsTypes = async (req, res) => {
  userModel
    .findById(req.body.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User Not found!",
        });
      } else {
        BookingsTypeModel.find({ userId: req.body.userId }).then((data) => {
          if (user.planStatus === "expired" && data.length === 1) {
            res.json({
              message: "meeting is expired",
            });
          } else {
            let bookingsType = new BookingsTypeModel({
              userId: req.body.userId,
              title: req.body.title,
              url: req.body.url,
              description: req.body.description,
              duration: req.body.duration,
              location: req.body.location,
              padding: req.body.padding,
              days_ahead: req.body.days_ahead,
              currentTime: req.body.currentTime,
              available: req.body.available,
              availableSlots: req.body.availableSlots,
              question: req.body.question,
              enableBookings: req.body.enableBookings,
              charge: req.body.charge,
              private: req.body.charge,
              days: req.body.days,
              time: req.body.time,
            });
            return bookingsType.save().then((data) => {
              return res.status(200).send({
                success: true,
                message: "Bookings successfully added",
                data: data,
              });
            });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while sending Booking.",
      });
    });
};

const updateBookingsTypes = async (req, res) => {
  if (
    !req.body.userId &&
    !req.body.title &&
    !req.body.url &&
    !req.body.description &&
    !req.body.duration &&
    !req.body.location &&
    !req.body.padding &&
    !req.body.days_ahead &&
    !req.body.currentTime &&
    !req.body.available &&
    !req.body.question &&
    !req.body.enableBookings &&
    !req.body.charge &&
    !req.body.private &&
    !req.body.days &&
    !req.body.time
  ) {
    return res.status(400).send({
      success: false,
      message: "Please enter bookings data",
    });
  }

  BookingsTypeModel.findByIdAndUpdate(
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
          message: "booking not found with id " + req.params.id,
        });
      }

      res.status(200).send({
        success: true,
        data: data,
    });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "booking not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating booking with id " + req.params.id,
      });
    });
};

const deleteBookingTypes = async (req, res) => {
  BookingsTypeModel.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Booking not found with id " + req.params.id,
        });
      }
      res.json({
        success: true,
        message: "Booking successfully deleted!",
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
        message: "Could not delete booking with id " + req.params.id,
      });
    });
};

module.exports = {
  getAllBookingsTypes,
  getBookingsTypes,
  getBookingsTypesById,
  getBookingsTypesByIdAndSave,
  addBookingsTypes,
  updateBookingsTypes,
  deleteBookingTypes,
};
