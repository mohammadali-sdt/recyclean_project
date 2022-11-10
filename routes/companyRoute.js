const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("company"));

router.route("/add/material").post(companyController.addMaterial);

router
  .route("/material/:id")
  .patch(companyController.editMaterial)
  .delete(companyController.deleteMaterial);

module.exports = router;
