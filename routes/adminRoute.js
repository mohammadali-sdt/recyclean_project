const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/delete/user").delete(adminController.deleteUser);
router.route("/add/agent").post(adminController.addAgent);

module.exports = router;
