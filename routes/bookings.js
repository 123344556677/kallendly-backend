const router = require("express").Router();

const {
  getBookings,
  getBookingsById,
  addBookings,
  updateBookings,
  deleteBooking,
  updateBookingsStatus,
  getBookingsByUserId,
  deleteSingleEvent,
  getBookingsByIdAndDate,
  test,
} = require("../controllers/bookings");

router.get("/getBookings", getBookings);
router.post("/getBookingsByUserId", getBookingsByUserId);
router.post("/getBookingsByIdAndDate", getBookingsByIdAndDate);
router.get("/getBookingsById/:id", getBookingsById);
router.post("/addBookings", addBookings);
router.post("/deleteSingleEvent", deleteSingleEvent);
router.put("/updateBookings/:id", updateBookings);
router.put("/updateBookingsStatus/:id", updateBookingsStatus);
router.delete("/deleteBookings/:id", deleteBooking);
router.get("/test", test);

module.exports = router;
