const express = require("express");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const debug = require("debug")("app:route:bank");
const router = express.Router();
const { User } = require("../models/User");
const { Bank, validate } = require("../models/Bank");

router.get("/", [Auth, Admin], async (req, res) => {
  const banks = await Bank.find().sort("bank_name");
  res.send(banks);
});

router.get("/:id", [Auth], async (req, res) => {
  const id = req.params.id;
  const bank = await Bank.findById({ user: id });
  if (!bank) return res.status(404).send("Add your bank details");
  res.status(200).send(bank);
});

router.post("/", [Auth], async (req, res) => {
  const { error } = validate(req.body);
  const id = req.user._id;
  if (error) return res.status(400).send(error.details[0].message);
  debug("Validated");
  const { message } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(400).send("Invalid User Id");
  const bank = new Bank({
    bank_name,
    bank_code,
    account_name,
    account_number,
    account_type,
    user: id,
  });

  await bank.save();
  res.send(bank);
});

router.put("/:id", [Auth, Admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  try {
    const bank = await Bank.findByIdAndUpdate(req.params.id);
    if (!bank)
      return res.status(404).send({
        success: false,
        message: "bank could not be found",
      });
    res.send(bank);
  } catch (e) {
    debug(e);
    return res.send({
      status: false,
      message: "There was an error",
    });
  }
});

router.delete("/:id", [Auth, Admin], async (req, res) => {
  const bank = await Bank.findByIdAndRemove(req.params.id);
  if (!bank)
    return res
      .status(404)
      .send({ success: false, message: "bank could not be found" });

  res.status(200).send(bank);
});

module.exports = router;
