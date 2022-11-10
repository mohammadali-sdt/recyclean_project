const express = require("express");
const clientController = require("../controllers/clientController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("client"));

router.route("/address").post(clientController.addAddress);

router
  .route("/address/:id")
  .patch(clientController.editAddress)
  .delete(clientController.deleteAddress);

router.route("/submit/order").post(clientController.submitOrder);

router.route("/cash/money").post(clientController.cashMoney);

router.route("/delete/order/:id").delete(clientController.deleteOrder);

module.exports = router;
