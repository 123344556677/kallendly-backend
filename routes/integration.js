const router = require("express").Router();

const {
  getAllRazorpay,
  razor,
  payment,
  paypal,
} = require("../controllers/integration");

router.get("/getAllRazorpay", getAllRazorpay);

router.post("/razorPay", razor);
router.post("/createPay", payment);
router.post("/paypalPay", paypal);

module.exports = router;
