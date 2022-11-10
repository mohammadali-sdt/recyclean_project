const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "A address must have city name."],
    lowercase: true,
  },
  street: {
    type: String,
    required: [true, "A address must have street name."],
    lowercase: true,
  },
  plaque: {
    type: String,
    lowercase: true,
    required: [true, "A address must have plaque number."],
  },
});

module.exports = addressSchema;
