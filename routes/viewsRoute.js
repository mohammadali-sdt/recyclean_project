const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();
router.route("/").get(authController.isLoggedIn, viewsController.indexPage);
router.route("/login").get(viewsController.loginPage);
router.route("/signup").get(viewsController.signupClientPage);
router.route("/company/signup").get(viewsController.signupCompanyPage);

router.use(authController.checkUserLoggedIn);

router.route("/home").get(viewsController.homePage);
router.route("/panel").get(viewsController.panelPage);
router.route("/panel/profile").get(viewsController.panelProfilePage);
router.route("/panel/password").get(viewsController.panelPasswordPage);

router
  .route("/panel/clients")
  .get(
    authController.restrictTo("admin"),
    viewsController.adminPanelClientsPage
  );

router
  .route("/panel/companies")
  .get(
    authController.restrictTo("admin"),
    viewsController.adminPanelCompaniesPage
  );

router
  .route("/panel/agents")
  .get(
    authController.restrictTo("admin"),
    viewsController.adminPanelAgentsPage
  );

router
  .route("/panel/add/agent")
  .get(
    authController.restrictTo("admin"),
    viewsController.adminPanelAddAgentsPage
  );

router
  .route("/client/submit/order")
  .get(authController.restrictTo("client"), viewsController.submitOrderPage);

router
  .route("/client/cash/money")
  .get(
    authController.restrictTo("client"),
    viewsController.clientCashMoneyPage
  );

router
  .route("/client/add/address")
  .get(
    authController.restrictTo("client"),
    viewsController.clientAddAddressPage
  );

router
  .route("/client/edit/address/:id")
  .get(
    authController.restrictTo("client"),
    viewsController.userEditAddressPage
  );

router
  .route("/panel/addresses")
  .get(
    authController.restrictTo("client"),
    viewsController.clientAddressesPanelPage
  );

router
  .route("/panel/address")
  .get(
    authController.restrictTo("delivery"),
    viewsController.agentAddressPanelPage
  );

router
  .route("/company/add/material")
  .get(authController.restrictTo("company"), viewsController.addMaterialPage);

router
  .route("/company/edit/material/:id")
  .get(
    authController.restrictTo("company"),
    viewsController.companyEditMaterialPage
  );

router
  .route("/panel/materials")
  .get(
    authController.restrictTo("company"),
    viewsController.companyMaterialsPanelPage
  );

router.route("/order/:id").get(viewsController.orderDetailPage);

router
  .route("/agent/order/history")
  .get(
    authController.restrictTo("delivery"),
    viewsController.agentOrderHistoryPage
  );

router
  .route("/agent/deliver/order/:id")
  .get(
    authController.restrictTo("delivery"),
    viewsController.agentDeliverOrderPage
  );

router
  .route("/agent/edit/address")
  .get(
    authController.restrictTo("delivery"),
    viewsController.userEditAddressPage
  );

module.exports = router;
