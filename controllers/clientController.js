const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const Material = require("../models/materialModel");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/ErrorHandler");

exports.addAddress = catchAsync(async (req, res, next) => {
  const { city, street, plaque } = req.body;
  await userModel.Client.findByIdAndUpdate(
    req.user.id,
    {
      address: [...req.user.address, { city, street, plaque }],
    },
    {
      runValidators: true,
    }
  );
  return res.status(201).json({
    status: "success",
    data: req.user.address,
  });
});

exports.editAddress = catchAsync(async (req, res, next) => {
  req.user.address.id(req.params.id).remove();
  const { city, street, plaque } = req.body;
  await userModel.Client.findByIdAndUpdate(
    req.user.id,
    {
      address: [...req.user.address, { city, street, plaque }],
    },
    {
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {},
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  req.user.address.id(req.params.id).remove();
  await userModel.Client.findByIdAndUpdate(
    req.user.id,
    {
      address: [...req.user.address],
    },
    {
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {},
  });
});

exports.submitOrder = catchAsync(async (req, res, next) => {
  const { materials = [], address } = req.body;

  if (materials.length === 0) {
    return next(new AppError("Materials not found.", 404));
  }

  const validMaterials = await Material.find({
    _id: { $in: materials.map((el) => mongoose.Types.ObjectId(el)) },
  });

  if (validMaterials.length !== materials.length) {
    return next(new AppError("Invalid material.", 401));
  }

  const new_order = await Order.create({
    client: req.user.id,
    materials: materials.filter(Boolean).map((material) => ({ material })),
    address: req.user.address.id(address),
  });
  res.status(201).json({
    status: "success",
    data: {
      order: new_order,
    },
  });
});

exports.cashMoney = catchAsync(async (req, res, next) => {
  const { card, money } = req.body;
  if (!Number(card) || card.length < 16) {
    return next(new AppError("Invalid Credit Card.", 401));
  }
  if (!Number(money)) {
    return next(new AppError("Invalid Cash.", 401));
  }
  if (req.user.credit < Number(money)) {
    return next(new AppError("Your credit low.", 401));
  }

  const new_credit = req.user.credit - Number(money);
  await userModel.Client.findByIdAndUpdate(
    req.user.id,
    {
      credit: new_credit,
    },
    {
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      credit: new_credit,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  console.log(order);
  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  if (req.user.id !== order.client.id) {
    return next(new AppError("You cannot access to this order.", 403));
  }
  if (order.status === "done") {
    return next(new AppError("You cannot delete this order.", 401));
  }
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {},
  });
});
