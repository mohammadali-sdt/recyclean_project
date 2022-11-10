const Material = require("../models/materialModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/ErrorHandler");

exports.addMaterial = catchAsync(async (req, res, next) => {
  const { material, unitPrice } = req.body;
  const new_material = await Material.create({
    material,
    unitPrice,
    company: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      new_material,
    },
  });
});

exports.editMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.findByIdAndUpdate(
    req.params.id,
    {
      material: req.body.material,
      unitPrice: req.body.unitPrice,
    },
    {
      runValidators: true,
    }
  );

  if (!material) {
    return next(new AppError("Material not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.deleteMaterial = catchAsync(async (req, res, next) => {
  await Material.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {},
  });
});
