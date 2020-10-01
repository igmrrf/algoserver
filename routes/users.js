const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const debug = require("debug")("app:route:user");
const router = express.Router();
const _ = require("lodash");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const { User, validate } = require("../models/User");

router.get("/", [Auth, Admin], async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.get("/:id", [Auth], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("user could not be found");
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const { name, email, password, country, mobile, gender } = req.body;
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  debug("Validated");
  let user = await User.findOne({ email: email });
  if (user) return res.status(400).send("User already exists");

  user = new User({
    name,
    email,
    password,
    mobile,
    gender,
    country,
  });
  debug("User Created");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  debug("User Saved");
  token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/:id", Auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { ...req.body });
    const updated = await User.findById(req.params.id);
    if (!user || !updated)
      return res.status(404).send("user could not be found");
    res.status(200).send(updated);
  } catch (error) {
    next(error);
  }
});

router.put("/password", Auth, async (req, res, next) => {
  const { password, newPassword } = req.body;
  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("user could not be found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Incorrect old password combination");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user = await user.save();
    res.status(200).send("Password Successfully Updated");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [Auth, Admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("user could not be found");

  res.status(200).send(user);
});

module.exports = router;
