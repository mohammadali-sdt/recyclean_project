const Order = require("../models/orderModel");
const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/ErrorHandler");
const {firstLetterUpperCase} = require("../utils/helper");

exports.deliverOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  if (
      order.address.city.toLowerCase() !== req.user.address.city.toLowerCase()
  ) {
    return next(new AppError("You're not able to deliver this order.", 403));
  }

  if (order.status === "done") {
    return next(new AppError("Order delivered already.", 401));
  }

  const {materials} = req.body;

  for (const type of Object.keys(materials)) {
    if (materials[type]) {
      if (!Number(materials[type])) {
        return next(
            new AppError(
                `${firstLetterUpperCase(type)} invalid value: ${materials[type]}`,
                401
            )
        );
      } else {
        materials[type] = Number(materials[type]);
      }
    } else {
      delete materials[type];
    }
  }

  order.materials = order.materials.map((materialDoc) => {
    materialDoc.amount = materials[materialDoc.material.material];
    order.price += materialDoc.amount * materialDoc.material.unitPrice;
    return materialDoc;
  });

  order.status = "done";
  order.deliveryAgent = req.user._id;
  await order.save();

  await userModel.Client.findByIdAndUpdate(
      order.client.id,
      {
        credit: order.client.credit + order.price,
      },
      {
        runValidators: true,
      }
  );

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.editAddress = catchAsync(async (req, res, next) => {
  const {city, street, plaque} = req.body;
  const user = await userModel.DeliveryAgent.findByIdAndUpdate(
      req.user.id,
      {
        address: {
          city,
          street,
          plaque,
        },
      },
      {
        runValidators: true,
      }
  );

  res.status(200).json({
    status: "success",
    data: {
      address: user.address,
    },
  });
});
