const mongoose = require("mongoose");
const debug = require("debug")("app:Supports");
const joi = require("@hapi/joi");
joi.objectId = require("joi-objectid")(joi);

const supportSchema = new mongoose.Schema({
  userId: {
    type: joi.objectId,
    ref: "User",
  },
  message: {
    type: String,
    default: "",
    required: true,
  },
});
const validateSupport = (data) => {
  debug("Validating");
  const schema = joi.object({
    message: joi.string().min(10).required(),
    subject: joi.string().min(3).required(),
  });
  return schema.validate(data);
};

module.exports = {
  Support: mongoose.model("Support", supportSchema),
  validate: validateSupport,
};
