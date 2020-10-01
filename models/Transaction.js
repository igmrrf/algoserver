const mongoose = require("mongoose");
const debug = require("debug")("app:Transactions");
const joi = require("@hapi/joi");
joi.objectId = require("joi-objectid")(joi);
const DefaultDate = new Date().toDateString();

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "",
    required: true,
    trim: true,
    minlength: 7,
    maxlength: 10,
  },
  receiptUrl: {
    type: String,
    default: "",
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  userId: {
    type: joi.objectId,
    ref: "User",
  },
  amount: {
    type: Number,
    default: "",
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  wallet: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Pending",
  },
  plan: {
    type: String,
    default: "",
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  date: {
    type: Date,
    default: DefaultDate,
  },
});
const validateTransaction = (data) => {
  debug("Validating");
  const schema = joi.object({
    type: joi.string().min(4).required(),
    receiptUrl: joi.string().min(10).required(),
    amount: joi.number().required(),
    plan: joi.string().required(),
    wallet: joi.string(),
  });
  return schema.validate(data);
};

module.exports = {
  Transaction: mongoose.model("Transaction", transactionSchema),
  validate: validateTransaction,
};
