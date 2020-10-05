const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const debug = require("debug")("app:route:user");
const router = express.Router();
const nodeMailer = require("nodemailer");
const _ = require("lodash");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const { User, validate } = require("../models/User");
const SendMail = require("../helpers/mailer");

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
  let subject = "Welcome To Blockchain Mining Tech";
  let content = `<h2 style="display: flex; align-items: center;">Welcome to Blockchain Mining Tech</h2>
      <h3>Hello: ${name} </h3> 
      <h3>Thank you for registering on Blockchain Mining Tech</h3> 

      <h2>Your login information:</h2> 
      <h3>Email: ${email}</h3> 
      <h3>Password: ${password}</h3>
      <h3>You can login here: https://www.blockchainminingtech.com/login</h3>
      <h3>Contact us immediately if you did not authorize this registration</h3>

      <h4>Best Regards, <b><span style="color: blue;">Blockchain Mining Tech</h4>`;
  const sent = await SendMail(email, subject, content);
  if (sent) res.header("x-auth-token", token).send(user);
  else
    res
      .status(400)
      .send("There's an error with your email, check and try again");
});

router.put("/:id", Auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: { ...req.body },
    });
    if (!user) return res.status(404).send("user could not be found");
    const subject = "Account Information Change";
    const content = `<h2 style="display: flex; align-items: center; justify-content:center;">Account Information Change Notification</h2>

    <h3>Hello: ${user.name} </h3> 
    <h3>This is to notify you that certain changes were initiated on your account</h3> 

    <h3>Contact us immediately if you did not authorize this change</h3>

    <h4>Best Regards, <b><span style="color: blue;">Blockchain Mining Tech</h4>`;
    const sent = await SendMail(user.email, subject, content);
    if (sent) res.status(200).send(user);
    else
      res
        .status(400)
        .send("There's an error with your email, contact support for help");
  } catch (error) {
    next(error);
  }
});

router.put("/balance/:id", [Auth, Admin], async (req, res, next) => {
  console.log(req.body);
  const { balance, deposits, withdraws, profits } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { balances: { balance, deposits, withdraws, profits } } },
      { new: true }
    );
    if (!user) return res.status(404).send("user could not be found");
    res
      .status(201)
      .send({ message: "User details successfully updated", data: user });
  } catch (error) {
    next(error);
  }
});

router.patch("/password/", Auth, async (req, res, next) => {
  const { password, newPassword } = req.body;
  console.log("here is done");
  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("user could not be found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Incorrect old password combination");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user = await user.save();
    const subject = "Password Change";
    const content = `<h2 style="display: flex; align-items: center; justify-content:center;">Password Change Notification</h2>

    <h3>Hello: ${user.name} </h3> 
    <h3>This is to notify you of the changes recently made on your account</h3> 

    <h2>Your login information:</h2> 
    <h3>Email: ${user.email}</h3> 
    <h3>Password: ${newPassword}</h3>
    <h3>You can login here: https://www.blockchainminingtech.com/login</h3>
    <h3>Contact us immediately if you did not authorize this change</h3>

    <h4>Best Regards, <b><span style="color: blue;">Blockchain Mining Tech</h4>`;
    const sent = await SendMail(user.email, subject, content);
    if (sent) res.status(200).send("Password Successfully Updated");
    else
      res
        .status(400)
        .send("There's an error with your email, contact support for help");
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
