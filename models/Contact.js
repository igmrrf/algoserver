const mongoose = require("mongoose");
const debug = require("debug")("app:Contacts");
const joi = require("@hapi/joi");
joi.objectId = require("joi-objectid")(joi);

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    email: {
        type: String,
        default: "",
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    message: {
        type: String,
        default: "",
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    }
});
const validateContact = (data) => {
    debug("Validating");
    const schema = joi.object({
        name: joi.string().min(2).required(),
        email: joi.string().email().required(),
        message: joi.string().min(0).required(),
    });
    return schema.validate(data);
};

module.exports = {
    Contact: mongoose.model("Contact", contactSchema),
    validate: validateContact,
};
