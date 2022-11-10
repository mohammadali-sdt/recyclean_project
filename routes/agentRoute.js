const express = require("express");
const agentController = require("../controllers/agentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("delivery"));

router.route("/deliver/order/:id").post(agentController.deliverOrder);
router.route("/address").patch(agentController.editAddress);

module.exports = router;
