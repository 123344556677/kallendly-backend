const router = require("express").Router();

const {
  getBookingsTypes,
  getBookingsTypesById,
  addBookingsTypes,
  updateBookingsTypes,
  deleteBookingTypes,
  getBookingsTypesByIdAndSave,
} = require("../controllers/bookingsType");

router.get("/getAllBookingsTypes", getBookingsTypes);
router.get("/getBookingsTypesById/:id", getBookingsTypesById);
router.post("/getBookingsTypesByIdAndSave/:id", getBookingsTypesByIdAndSave);
router.post("/getBookingsTypes", getBookingsTypes);
router.post("/addBookingsTypes", addBookingsTypes);
router.put("/updateBookingsTypes/:id", updateBookingsTypes);
router.delete("/deleteBookingTypes/:id", deleteBookingTypes);

module.exports = router;
