const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signUp);
router.post("/company/signup", authController.companySignUp);
router.get("/logout", authController.logout);

router.use(authController.protect);
router.route("/user/profile").patch(authController.updateUserProfile);
router.route("/user/password").patch(authController.userChangePassword);

module.exports = router;
