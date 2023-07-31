const router = require("express").Router();

const {
  getUsers,
  userRegister,
  googleLogin,
  microsoftLogin,
  getUsersById,
  loginUser,
  updateUser,
  forgetPasswordLink,
  forgetPassword,
  sendMail,
} = require("../controllers/user");

router.get("/getUsers", getUsers);
router.get("/getUsersById/:id", getUsersById);
router.post("/googleLogin", googleLogin);
router.post("/microsoftLogin", microsoftLogin);
router.post("/userRegister", userRegister);
router.post("/loginUser", loginUser);
router.post("/sendMail", sendMail);
router.put("/updateUser/:id", updateUser);
router.put("/forgetPasswordLink", forgetPasswordLink);
router.put("/forgetPassword", forgetPassword);

module.exports = router;
