const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  material: {
    type: String,
    enum: {
      values: ["paper", "metal", "plastic", "glass", "electric"],
      message:
        "material must be paper or metal or plastic or glass or electric.",
    },
    required: [true, "material must have type."],
  },
  unitPrice: {
    type: Number,
    validate: {
      validator: function (v) {
        return /\d+/.test(v);
      },
      message: "{VALUE} is not a valid price.",
    },
    required: [true, "material must have unit price."],
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
  },
});

materialSchema.index({ material: 1, company: 1 }, { unique: true });

materialSchema.pre(/^find/, function (next) {
  this.populate({
    path: "company",
    select: "-__v",
  });
  next();
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
