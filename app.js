const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute");
const adminRouter = require("./routes/adminRoute");
const clientRouter = require("./routes/clientRoute");
const companyRouter = require("./routes/companyRoute");
const agentRouter = require("./routes/agentRoute");
const viewsRouter = require("./routes/viewsRoute");

const AppError = require("./utils/ErrorHandler");
const errorController = require("./controllers/errorController");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);
app.use("/api/company", companyRouter);
app.use("/api/agent", agentRouter);
app.use("/", viewsRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(errorController);

module.exports = app;
