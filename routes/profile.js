const router = require("express").Router();

const {
  getProfile,
  addProfile,
  updateProfile,
  deleteProfile,
  getProfileById,
  updateProfileById
} = require("../controllers/profile");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/profile-picture");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/getProfile", getProfile);
router.post("/addProfile", upload.single("ProfilePicture"), addProfile);
router.put(
  "/updateProfile/:id",
  upload.single("ProfilePicture"),
  updateProfile
);
router.delete("/deleteProfile/:id", deleteProfile);
router.post("/getUserProfile", getProfileById);
router.put("/updateUserProfile", updateProfileById);

module.exports = router;
