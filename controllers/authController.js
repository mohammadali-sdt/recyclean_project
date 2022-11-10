const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/ErrorHandler");
const { promisify, log } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const new_user = await userModel.Client.create({
    phone: req.body.phone,
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  return createSendToken(new_user, 201, res);
});

exports.companySignUp = catchAsync(async (req, res, next) => {
  const new_company = await userModel.Company.create({
    username: req.body.username,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  return createSendToken(new_company, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError("Please Provide username or password.", 400));
  }
  const user = await userModel.User.findOne({ username }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Your username or password wrong.", 401));
  }
  return createSendToken(user, 201, res);
});

// exports.companyLogin = catchAsync(async (req, res, next) => {
//     const {username, password} = req.body
// });

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1 - check token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("Please log in to get access.", 401));
  }
  // 2) if token exist means that user is logged In, and get payload from token and find user
  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await userModel.User.findById(id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token does no longer exist!")
    );
  }
  // 3) put user in request for next middleware, and set user in locals for views.and call next
  req.user = user;
  res.locals.user = user;
  next();
});

// only for rendered pages
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const { id } = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const user = await userModel.User.findById(id);
      if (!user) {
        return next();
      }
      req.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
  req.user = undefined;
  return next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// for rendered pages
exports.checkUserLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.redirect("/");
  }
  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  req.user = await userModel.User.findById(id);
  res.locals.user = req.user;
  return next();
};

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const user = await userModel.User.findByIdAndUpdate(
    req.user.id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      phone: req.body.phone,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.userChangePassword = catchAsync(async (req, res, next) => {
  const user = await userModel.User.findById(req.user.id).select("+password");
  const { password, newPassword, newPasswordConfirm } = req.body;
  if (!(await user.comparePassword(password, user.password))) {
    return next(new AppError("Your old password is wrong.", 401));
  }
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();
  return createSendToken(user, 200, res);
});
