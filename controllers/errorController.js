const AppError = require("../utils/ErrorHandler");
const { firstLetterUpperCase } = require("../utils/helper");

const sendErrorDev = (err, req, res) => {
  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = err.path + " must be " + err.kind + ".";
  }

  if (err.code === "11000" || err.code === 11000) {
    const messages = Object.keys(err.keyPattern).map((el) => {
      if (el === "material" || el === "company") {
        return "You added this material.";
      }
      return `${firstLetterUpperCase(el)} Already Used.`;
    });
    err.message = [...new Set(messages)];
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors).map((el) => {
      if (el.message.startsWith("Cast")) {
        return `${
          el.path === "unitPrice" ? "Unit Price" : el.path
        } Invalid Value: ${el.value}`;
      }
      return `${el.message}`;
    });
  }

  if (req.originalUrl.startsWith("/api")) {
    // A) API
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  // console.error('ERROR 💥', err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
    code: err.statusCode,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  }
};
