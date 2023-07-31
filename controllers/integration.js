const Razorpay = require("razorpay");
const Razor = require("../models/integration");
const userModel = require("../models/user");

const razorpay = new Razorpay({
  key_id: "rzp_test_4GGNxLh0s3F5pA",
  key_secret: "dHm4MYjItHOQDQsvxD30ylWq",
});

const getAllRazorpay = async (req, res) => {
  try {
    Razor.find()
      .then((data) => {
        return res.status(200).json({ success: true, data });
      })
      .catch((err) => {
        return res.status(400).json({ success: false, err });
      });
  } catch (error) {
    console.log(error);
  }
};

const razor = async (req, res) => {
  console.log(req.body.amount, "===================>>>>>>");
  try {
    userModel.findOne({ UserId: req.body.UserId }, async (err, data) => {
      if (data) {
        const payment_capture = 1;
        // const amount = 1;
        const amount = req.body.amount;
        const currency = "USD";
        const options = {
          amount: amount * 100,
          currency,
          // receipt: shortid.generate(),
          payment_capture: payment_capture,
        };

        try {
          const response = await razorpay.orders.create(options);
          res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
          });
        } catch (error) {
          console.log(error);
          return res.status(400).json({ success: false, err });
        }
      } else {
        return res.status(400).json({ message: "User Not Found" });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Error in Server" });
  }
};

const payment = async (req, res) => {
  console.log(req.body);
  userModel.findOne({ UserId: req.body.UserId }, async (err, data) => {
    if (data) {
      //   if (req.body.payment === true) {
      Razor.create({
        userId: req.body.UserId,
        orderId: req.body.id,
        amountPaid: req.body.amountPaid,
      });
      res.status(200).json({ message: "Payment Succeeded" });
    } else {
      res.status(400).json({ message: "Payment not succeeded" });
    }
  });
};

const paypal = async (req, res) => {
  try {
    userModel.findOne({ UserId: req.body.UserId }, async (err, data) => {
      if (data) {
        Razor.create({
          userId: req.body.UserId,
          orderId: req.body.id,
          amountPaid: req.body.amountPaid,
        });
        return res.status(200).json({ message: "Payment Succeeded" });
      } else {
        return res.status(400).json({ message: "User Not Found" });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", err });
  }
};

module.exports = {
  getAllRazorpay,
  razor,
  payment,
  paypal,
};
