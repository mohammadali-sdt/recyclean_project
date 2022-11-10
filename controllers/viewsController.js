const Order = require("../models/orderModel");
const Material = require("../models/materialModel");
const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/ErrorHandler");

exports.indexPage = (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }
  res.render("home", {
    title: "Home",
  });
};

exports.homePage = (req, res, next) => {
  if (req.user) {
    switch (req.user.role) {
      case "client":
        return clientHome(req.user, res, next);
      case "delivery":
        return deliveryHome(req.user, res, next);
      case "company":
        return companyHome(req.user, res, next);
      case "admin":
        return res.redirect("/panel");
    }
  }
};

exports.panelPage = (req, res, next) => {
  if (req.user) {
    switch (req.user.role) {
      case "admin":
        return adminPanel(req.user, res, next);
      case "client":
      case "delivery":
      case "company":
        return res.redirect("/panel/profile");
    }
  }
};

exports.adminPanelClientsPage = catchAsync(async (req, res, next) => {
  const clients = await userModel.Client.find();
  res.render("admin-users", {
    title: "Your Clients",
    users: clients,
    path: "/panel/clients",
  });
});

exports.adminPanelCompaniesPage = catchAsync(async (req, res, next) => {
  const companies = await userModel.Company.find();
  res.render("admin-users", {
    title: "Your Companies",
    users: companies,
    path: "/panel/companies",
  });
});

exports.adminPanelAgentsPage = catchAsync(async (req, res, next) => {
  const agents = await userModel.DeliveryAgent.find();
  res.render("admin-users", {
    title: "Your Agents",
    users: agents,
    path: "/panel/agents",
  });
});

exports.adminPanelAddAgentsPage = (req, res) => {
  res.render("admin-add-agent", {
    title: "Add New Agent",
    path: "/panel/add/agent",
  });
};

exports.panelProfilePage = (req, res) => {
  res.render("user-profile", {
    title: "Your Profile",
    path: "/panel/profile",
  });
};

exports.panelPasswordPage = (req, res) => {
  res.render("user-password", {
    title: "Change Your Password",
    path: "/panel/password",
  });
};

exports.clientAddressesPanelPage = catchAsync(async (req, res, next) => {
  res.render("user-address", {
    title: "Your Addresses",
    addresses: req.user.address,
    path: "/panel/addresses",
  });
});

exports.agentAddressPanelPage = catchAsync(async (req, res, next) => {
  res.render("user-address", {
    title: "Your address",
    address: req.user.address,
    path: "/panel/address",
  });
});

exports.companyMaterialsPanelPage = catchAsync(async (req, res, next) => {
  const materials = await Material.find({
    company: req.user.id,
  });
  res.render("company-materials", {
    title: "Your Materials",
    materials,
    path: "/panel/materials",
  });
});

exports.companyEditMaterialPage = catchAsync(async (req, res, next) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    return next(new AppError("Material not found.", 404));
  }

  res.render("company-edit-material", {
    title: "Edit Your Material",
    material,
  });
});

exports.loginPage = (req, res) => {
  res.render("login", {
    title: "Login",
  });
};

exports.signupClientPage = (req, res) => {
  res.render("client-signup", {
    title: "SignUp",
  });
};

exports.signupCompanyPage = (req, res) => {
  res.render("company-signup", {
    title: "Register Your Company",
  });
};

exports.addMaterialPage = (req, res) => {
  res.render("company-add-material", {
    title: "Add New Material",
  });
};

exports.submitOrderPage = catchAsync(async (req, res, next) => {
  if (!req.user.address.length) {
    return res.render("client-add-address", {
      title: "Add Address",
      message: "Please Add Address first",
      redirect: "/client/submit/order",
    });
  }
  const materials = await Material.find();
  const userAddresses = req.user.address;
  res.render("client-submit-order", {
    title: "Submit Order",
    materials,
    userAddresses,
  });
});

exports.agentDeliverOrderPage = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  if (
    order.address.city.toLowerCase() !== req.user.address.city.toLowerCase()
  ) {
    return next(new AppError("Your not able to deliver this order.", 403));
  }

  if (order.status === "done") {
    return next(new AppError("Order delivered already.", 401));
  }

  res.render("agent-deliver-order", {
    title: "Deliver an Order",
    order,
  });
});

exports.agentOrderHistoryPage = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    status: "done",
    deliveryAgent: req.user.id,
  });
  res.render("user-home", {
    title: "Your History",
    orders,
  });
});

exports.clientAddAddressPage = (req, res) => {
  res.render("client-add-address", {
    title: "Add New Address",
    message: false,
    redirect: false,
  });
};

exports.userEditAddressPage = (req, res) => {
  res.render("user-edit-address", {
    title: "Edit Your Address",
    address:
      req.user.role === "client"
        ? req.user.address.id(req.params.id)
        : req.user.address,
  });
};

exports.clientCashMoneyPage = (req, res) => {
  res.render("client-cash-money", {
    title: "Cash Your Money",
  });
};

exports.orderDetailPage = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError("Order Not Found", 404));
  }

  if (req.user.role === "client" && order.client.id !== req.user.id) {
    return next(new AppError("You cannot access to this order.", 403));
  }

  if (
    req.user.role === "company" &&
    !order.materials.some((m) => m.material.company.id === req.user.id)
  ) {
    return next(new AppError("You cannot access to this order.", 403));
  }

  if (
    req.user.role === "delivery" &&
    order.address.city !== req.user.address.city
  ) {
    return next(new AppError("You cannot access to this order.", 403));
  }

  res.render("user-order-detail", {
    title: "Order Detail",
    order,
  });
});

const clientHome = async (user, res, next) => {
  try {
    const clientOrders = await Order.find({
      client: user._id,
    });
    res.render("user-home", {
      title: "Home",
      orders: clientOrders,
    });
  } catch (err) {
    return next(new AppError("User Not Found.", 404));
  }
};

const deliveryHome = async (user, res, next) => {
  try {
    const deliveryOrders = await Order.find({
      "address.city": user.address.city,
      status: "pending",
    });
    res.render("user-home", {
      title: "Home",
      orders: deliveryOrders,
    });
  } catch (err) {
    return next(new AppError("Page Not Found.", 404));
  }
};

const companyHome = async (user, res, next) => {
  try {
    const companyOrders = await Order.aggregate([
      {
        $lookup: {
          from: "materials",
          localField: "materials.material",
          foreignField: "_id",
          as: "material",
        },
      },
      {
        $match: { "material.company": user._id },
      },
    ]);
    res.render("user-home", {
      title: "Home",
      orders: companyOrders,
    });
  } catch (err) {
    return next(new AppError("Page Not Found.", 404));
  }
};

const adminPanel = async (user, res, next) => {
  try {
    const orders = await Order.find();
    res.render("admin-home", {
      title: "Your Panel",
      orders,
      path: "/panel",
    });
  } catch (err) {
    return next(new AppError("Page Not Found.", 404));
  }
};
