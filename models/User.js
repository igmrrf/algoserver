const mongoose = require("mongoose");
const debug = require("debug")("app:model:genre");
const joi = require("@hapi/joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    min: 5,
    max: 50,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    default: "",
    min: 5,
    max: 100,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
    required: true,
  },
  country: {
    type: String,
    default: "",
    required: true,
  },
  gender: {
    type: String,
    default: "",
    required: true,
  },
  mobile: {
    type: String,
    default: "",
    required: true,
  },
  balances: {
    deposits: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    },
    balance: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    },
    profits: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    },
    withdraws: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    },
  },
  plan: {
    type: String,
    default: "Basic",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("vividly_jwtkey")
  );
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  debug("Validating");
  const schema = joi.object({
    name: joi.string().min(5).max(60).required(),
    email: joi.string().email().min(5).max(100).required(),
    password: joi.string().min(8).max(255),
    plan: joi.string().min(5).max(20),
    country: joi.string().min(3).max(100).required(),
    gender: joi.string().min(4).max(100).required(),
    mobile: joi.string().min(5).max(100).required(),
  });
  return schema.validate(user);
};

module.exports = {
  User: User,
  validate: validateUser,
  userSchema,
};
