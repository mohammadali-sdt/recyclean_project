const mongoose = require("mongoose");
const addressSchema = require("./addressSchema");

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
      required: [true, "Order needs a client ID."],
    },
    deliveryAgent: {
      type: mongoose.Schema.ObjectId,
      ref: "DeliveryAgent",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "done"],
        message: "status must be pending or done.",
      },
      default: "pending",
    },
    price: {
      type: Number,
      default: 0,
    },
    address: {
      type: addressSchema,
      required: [true, "Order must have address."],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    materials: {
      type: [
        {
          material: {
            type: mongoose.Schema.ObjectId,
            ref: "Material",
          },
          amount: {
            type: Number,
            default: 0,
          },
        },
      ],
      validate: {
        validator: function (value) {
          return value.length !== 0;
        },
        message: "Order must have a material.",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "-__v",
  })
    .populate({
      path: "deliveryAgent",
      select: "-__v",
    })
    .populate({
      path: "materials.material",
      select: "-__v",
    })
    .populate({
      path: "materials.material.company",
      select: "-__v",
    });
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
