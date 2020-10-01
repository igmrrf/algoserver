const bcrypt = require("bcrypt");
const config = require("config");
const joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const express = require("express");
const debug = require("debug")("app:route:user");
const router = express.Router();
const _ = require("lodash");
const { User } = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  debug("Validated");
  let user = await User.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(user);
});

const validate = (query) => {
  debug("Validating");
  const schema = joi.object({
    email: joi.string().email().min(5).max(100).required(),
    password: joi.string().min(5).max(255).required(),
  });
  return schema.validate(query);
};

module.exports = router;
