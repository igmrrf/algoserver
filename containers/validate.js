const joi = require("@hapi/joi");

module.exports = function () {
  joi.objectId = require("joi-objectid")(joi);
};
