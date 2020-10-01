const mongoose = require("mongoose");
const debug = require("debug")("app:userSessions");
const joi = require("@hapi/joi");
joi.objectId = require("joi-objectid")(joi);

const userSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: "",
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    timestamp: {
        type: Date,
        default:Date.now(),
        expires: 43200,
    }
});
const validateUserSession= (data) => {
    debug("Validating");
    const schema = joi.object({
        userId: joi.objectId().required(2),
    });
    return schema.validate(data);
};

module.exports = {
    UserSession: mongoose.model("UserSession", userSessionSchema),
    validate: validateUserSession(),
};
