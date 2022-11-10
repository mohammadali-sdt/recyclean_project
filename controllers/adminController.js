const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  await userModel.User.findByIdAndDelete(user);
  res.status(200).json({
    status: "success",
    data: {},
  });
});

exports.addAgent = catchAsync(async (req, res, next) => {
  const new_agent = await userModel.DeliveryAgent.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    address: {
      city: req.body.city,
      street: req.body.street,
      plaque: req.body.plaque,
    },
  });
  res.status(201).json({
    status: "success",
    data: {
      agent: new_agent,
    },
  });
});
