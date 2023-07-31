const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const addTime = require("add-time");

const client = new OAuth2Client(
  "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com" // client id
);

const getUsers = async (req, res) => {
  userModel
    .find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getUsersById = async (req, res) => {
  userModel
    .findById(req.params.id)
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const userRegister = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);

  const today = new Date();
  const expiryDate = addTime(today, {
    days: 7,
  });

  let user = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    userRole: req.body.userRole,
    loggedInWithGoogle: req.body.loggedInWithGoogle,
    isPremium: true,
    planType: "free",
    planStatus: "continued",
    planStartDate: today,
    planEndDate: expiryDate,
  });

  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.json({
        data: userExists,
        message: "Email already exist",
      });
    }
    if (Object.keys(user).length === 0) {
      res.send({
        success: false,
        message: "Invalid Request",
      });
      return;
    }
    user
      .save()
      .then((data) => {
        return res.status(200).send({
          success: true,
          message: "Message successfully send",
          data: data,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message:
            err.message || "Some error occurred while sending a message.",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Service unavailable",
    });
  }
};

const forgetPasswordLink = async (req, res) => {
  try {
    userModel.findOne({ email: req.body.email }, (err, data) => {
      if (data) {
        //   try {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "hmughal0123@gmail.com",
            pass: "cxiswypaujnticyo",
          },
        });
        let email = data.email;

        var mailOptions = {
          from: "connect@kallendly.com",
          to: email,
          subject: "Password reset",
          html:
            "<h3>Hello!</h3>" +
            "<p>You are receiving this email because we received a password reset request for your account.</p>" +
            `<a href="https://kallendly.com/ForgetPassword/${email}"  style="background-color:black; margin-top:10px;
           margin-bottom:10px margin-left:30px; color:white; padding:6px; border-radius: 2px;"  >
          Reset password</a>` +
            "<p>If you did not request a password reset, no further action is required.</p>" +
            "<p>Regards,</p>" +
            "<p>Kalendly</p>",
          text: "That was easy!",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            return res.status(400).json({ message: "Email not Sent" });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ message: "Email Sent" });
          }
        });
      } else {
        return res.status(400).json({ message: "Email not exist" });
      }
    });
  } catch (err) {
    return res.status(404).json({ message: "Network Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    userModel.findOne({ email: req.body.email }, (err, data) => {
      if (data) {
        const token = jwt.sign({ email: req.body.email }, "test");
        console.log("hannan");
        if (bcrypt.compareSync(req.body.password, data.password)) {
          res.json({ success: true, data, token, message: "Login Successful" });
        } else {
          res.json({ message: "Password Invalid" });
        }
      } else {
        res.json({ message: "Email Invalid" });
      }
    });
    // .then((user) => {
    //   const token = jwt.sign({ email: req.body.email }, "test");
    //   if (bcrypt.compareSync(req.body.password, user.password)) {
    //      res.status(200).json({ success: true, user, token });
    //   } else {
    //      res.status(400).json({message:"Password Invalid"});
    //   }
    // })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message || "Service unavailable",
    });
  }
};

const updateUser = async (req, res) => {
  if (
    !req.body.name &&
    !req.body.email &&
    !req.body.password &&
    !req.body.planEndDate &&
    !req.body.planStartDate &&
    !req.body.planType &&
    !req.body.planStatus &&
    !req.body.isPremium
  ) {
    return res.status(400).send({
      success: false,
      message: "Please enter email name and password",
    });
  }
  userModel
    .findByIdAndUpdate(
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
          message: "Product not found with id " + req.params.id,
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
          message: "Product not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Sevice unavailable" + req.params.id,
      });
    });
};

const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        userModel.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              message: "Somthing went wrong",
            });
          } else {
            if (user) {
              const token = jwt.sign({ email: req.body.email }, "test");
              const {
                _id,
                name,
                email,
                loggedInWithGoogle,
                isPremium,
                planStartDate,
                planEndDate,
                planType,
                planStatus,
              } = user;

              res.json({
                token,
                user: {
                  _id,
                  name,
                  email,
                  loggedInWithGoogle,
                  isPremium,
                  planStartDate,
                  planEndDate,
                  planType,
                  planStatus,
                },
              });
            } else {
              let password = email + process.env.JWT_SIGNIN_KEY;
              let loggedInWithGoogle = true;
              let isPremium = false;
              let planStartDate = new Date();
              let planEndDate = addTime(planStartDate, {
                days: 7,
              });
              let planType = "none";
              let planStatus = "continued";

              let newUser = new userModel({
                name,
                email,
                password,
                loggedInWithGoogle,
                isPremium,
                planStartDate,
                planEndDate,
                planType,
                planStatus,
              });

              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    message: "Something went wrong",
                  });
                }
                const token = jwt.sign({ email: req.body.email }, "test");
                const {
                  _id,
                  name,
                  email,
                  loggedInWithGoogle,
                  isPremium,
                  planStartDate,
                  planEndDate,
                  planType,
                  planStatus,
                } = newUser;

                res.json({
                  token,
                  user: {
                    _id,
                    name,
                    email,
                    loggedInWithGoogle,
                  },
                });
              });
            }
          }
        });
      }
    });
};

const microsoftLogin = async (req, res) => {
  const { email, name } = req.body;
  userModel.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "Somthing went wrong",
      });
    } else {
      if (user) {
        const token = jwt.sign({ email: req.body.email }, "test");
        const {
          _id,
          name,
          email,
          userRole,
          loggedInWithGoogle,
          loggedInWithMicrosoft,
        } = user;
        res.json({
          token,
          user: {
            _id,
            name,
            email,
            userRole,
            loggedInWithGoogle,
            loggedInWithMicrosoft,
          },
        });
      } else {
        let password = email;
        let loggedInWithGoogle = false;
        let loggedInWithMicrosoft = true;
        let userRole = "user";
        let newUser = new userModel({
          name,
          email,
          password,
          userRole,
          loggedInWithGoogle,
          loggedInWithMicrosoft,
        });
        newUser.save((err, data) => {
          if (err) {
            return res.status(400).json({
              message: "Something went wrong",
            });
          }
          const token = jwt.sign({ email: req.body.email }, "test");
          const {
            _id,
            name,
            email,
            userRole,
            loggedInWithGoogle,
            loggedInWithMicrosoft,
          } = newUser;
          res.json({
            token,
            user: {
              _id,
              name,
              email,
              userRole,
              loggedInWithGoogle,
              loggedInWithMicrosoft,
            },
          });
        });
      }
    }
  });
};

const forgetPassword = (req, res) => {
  console.log(req.body);
  const salt = bcrypt.genSaltSync(10);
  console.log(req.body);
  try {
    userModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: bcrypt.hashSync(req.body.password, salt) } },
      { new: true },
      (err, data) => {
        if (data) {
          console.log("hannan forget");
          return res
            .status(200)
            .json({ message: "Password updated successfully" });
        } else {
          console.log("email not found");
          return res.status(400).json({ message: "Email not found" });
        }
      }
    );
  } catch (err) {
    return res.status(400).json({ message: "Network error" });
  }
};

const sendMail = (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hmughal0123@gmail.com",
      pass: "cxiswypaujnticyo",
    },
  });

  var mailOptions = {
    from: "connect@kallendly.com",
    to: req.body.email,
    subject: "Plan expired",
    html:
      "<h3>Hello!</h3>" +
      "<p>Your premium plan has been expired at</p>" +
      "<p>Regards,</p>" +
      "<p>Kalendly</p>" +
      "<p>click on the link to renew your plan <a href='https://kallendly.com/api/pricing'>Click here</a><p/>",
    // text: "That was easy!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).json({ message: "Email not Sent" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email Sent", data: data });
    }
  });

  return res.status(200).send({
    message: "success",
  });
};

module.exports = {
  getUsers,
  getUsersById,
  googleLogin,
  microsoftLogin,
  userRegister,
  loginUser,
  updateUser,
  forgetPasswordLink,
  forgetPassword,
  sendMail,
};
