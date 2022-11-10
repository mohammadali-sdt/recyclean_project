const mongoose = require("mongoose");
const addressSchema = require("./addressSchema");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      minlength: [3, "Firstname minimum is 3 character."],
      maxlength: [255, "Firstname maximum is 255 character."],
      lowercase: true,
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname minimum is 3 character."],
      maxlength: [255, "Lastname maximum is 255 character."],
      lowercase: true,
    },
    username: {
      type: String,
      unique: [true, "username Already Used."],
      minlength: [3, "username of user minimum is 3 character."],
      maxlength: [255, "username of user maximum is 255 character."],
      required: [true, "Username is required."],
      dropDups: true,
    },
    phone: {
      type: String,
      unique: [true, "Phone Number Already Used."],
      minlength: [11, "PhoneNumber must be 11 digits."],
      maxlength: [11, "PhoneNumber must be 11 digits."],
      required: [true, "PhoneNumber is required."],
      dropDups: true,
      validate: {
        validator: function (value) {
          return value.match(/^(09)\d{9}$/g);
        },
        message: "Phone invalid format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password minimum is 8 character."],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "PasswordConfirm is required."],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords are not the same.",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: "role",
  }
);

userSchema.index({ phone: 1 });
userSchema.index({ username: 1 });

userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async (
  userEnteredPassword,
  hashedPassword
) => {
  return await bcrypt.compare(userEnteredPassword, hashedPassword);
};

const User = mongoose.model("User", userSchema);

const clientSchema = new mongoose.Schema({
  address: [
    {
      type: addressSchema,
      require: ["Address is required."],
    },
  ],
  credit: {
    type: Number,
    default: 0,
  },
});

const Client = User.discriminator("Client", clientSchema, "client");

const deliveryAgentSchema = new mongoose.Schema({
  address: {
    type: addressSchema,
    require: ["Address is required."],
  },
});

const DeliveryAgent = User.discriminator(
  "DeliveryAgent",
  deliveryAgentSchema,
  "delivery"
);

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "name of company minimum is 3 character."],
    maxlength: [255, "name of company maximum is 255 character."],
    lowercase: true,
  },
});

const Company = User.discriminator("Company", companySchema, "company");

const adminSchema = new mongoose.Schema({});
const Admin = User.discriminator("Admin", adminSchema, "admin");

exports.User = User;
exports.Admin = Admin;
exports.Company = Company;
exports.Client = Client;
exports.DeliveryAgent = DeliveryAgent;
