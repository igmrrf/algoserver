const mongoose = require("mongoose");
const debug = require("debug")("app:banks");
const joi = require("@hapi/joi");
const Shema = mongoose.Schema;

joi.objectId = require("joi-objectid")(joi);
const DefaultDate = new Date().toDateString();

const bankSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    default: "",
    required: true,
    trim: true,
  },
  user: {
    type: joi.objectId,
    ref: "User",
  },
  bank_code: {
    type: String,
    default: "",
    required: true,
    trim: true,
  },
  account_name: {
    type: String,
    default: "",
    required: true,
    trim: true,
  },
  account_number: {
    type: Number,
    default: "",
    required: true,
  },
  account_type: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: DefaultDate,
  },
});
const validateBank = (data) => {
  debug("Validating");
  const schema = joi.object({
    bank_code: joi.string().required(),
    bank_name: joi.string().required(),
    account_number: joi.number().required(),
    account_name: joi.string().required(),
    account_type: joi.string(),
  });
  return schema.validate(data);
};

module.exports = {
  Bank: mongoose.model("Bank", bankSchema),
  validate: validateBank,
};
