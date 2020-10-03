const express = require("express");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const debug = require("debug")("app:route:Support");
const router = express.Router();
const { User } = require("../models/User");
const { Support, validate } = require("../models/Support");

router.get("/", [Auth, Admin], async (req, res) => {
  return res.status(400).send("You have no referrals");
  const supports = await Support.find().sort("name");
  res.send(supports);
});

router.get("/:id", [Auth], async (req, res) => {
  return res.status(400).send("You have no referrals");
  const support = await Support.findById(req.params.id);
  if (!support)
    return res
      .status(404)
      .send({ success: false, message: "support could not be found" });
  res.status(200).send(support);
});

router.post("/", [Auth], async (req, res) => {
  return res.status(400).send("You have no referrals");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  debug("Validated");
  const { message, subject } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Invalid User Id");
  const userId = req.user._id;
  const support = new Support({
    userId,
    subject,
    message,
  });

  await support.save();
  res.send({
    success: true,
    message: "Check your email within the next 24 hours for response",
  });
});

router.put("/:id", [Auth, Admin], async (req, res) => {
  return res.status(400).send("You have no referrals");
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  try {
    const support = await Support.findByIdAndUpdate(req.params.id);
    if (!support)
      return res.status(404).send({
        success: false,
        message: "support could not be found",
      });
    res.send(support);
  } catch (e) {
    debug(e);
    return res.send({
      status: false,
      message: "There was an error",
    });
  }
});

router.delete("/:id", [Auth, Admin], async (req, res) => {
  return res.status(400).send("You have no referrals");
  const support = await Support.findByIdAndRemove(req.params.id);
  if (!support)
    return res
      .status(404)
      .send({ success: false, message: "support could not be found" });

  res.status(200).send(support);
});

module.exports = router;
