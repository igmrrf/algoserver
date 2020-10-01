const express = require("express");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const debug = require("debug")("app:route:Contact");
const router = express.Router();
const { Contact, validate } = require("../models/Contact");
const { User } = require("../models/User");

router.get("/", [Auth, Admin], async (req, res) => {
  const contact = await Contact.find().sort("name");
  res.send(contact);
});

router.get("/:id", [Auth, Admin], async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact)
    return res
      .status(404)
      .send({ success: false, message: "contact could not be found" });
  res.status(200).send(contact);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  debug("Validated");
  const { name, email, message } = req.body;
  const contact = new Contact({
    name,
    email,
    message,
  });
  await contact.save();
  res.status(201).send({
    success: true,
    message: "Message successfully sent",
  });
});

router.put("/:id", [Auth, Admin], async (req, res, next) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id);
    if (!contact)
      return res.status(404).send({
        success: false,
        message: "contact could not be found",
      });
    res.send(contact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [Auth, Admin], async (req, res) => {
  const contact = await Contact.findByIdAndRemove(req.params.id);
  if (!contact)
    return res
      .status(404)
      .send({ success: false, message: "contact could not be found" });

  res.status(200).send(contact);
});

module.exports = router;
