const express = require("express");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const debug = require("debug")("app:route:transaction");
const router = express.Router();
const _ = require("lodash");
const { Transaction, validate } = require("../models/Transaction");
const { User } = require("../models/User");

router.get("/", [Auth, Admin], async (req, res) => {
  const transactions = await Transaction.find().sort("name");
  res.send(transactions);
});

router.get("/:id", [Auth], async (req, res) => {
  const transaction = await Transaction.find({
    userId: req.params.id,
  });
  if (!transaction)
    return res
      .status(404)
      .send({ success: false, message: "transactions could not be found" });
  res.status(200).send({
    success: true,
    data: transaction,
  });
});

router.post("/", [Auth], async (req, res) => {
  const userId = req.user._id;
  if (req.body.type === "Withdraw")
    req.body.receiptUrl = "https://picsum.com/random?200";
  if (req.body.type === "Deposit") req.body.wallet = "No wallet";
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  debug("Validated");
  const { receiptUrl, amount, plan, wallet, type } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).send("Invalid genre Id");

  const transaction = new Transaction({
    type,
    receiptUrl,
    amount,
    plan,
    wallet,
    userId,
  });
  await transaction.save();
  res.status(200).send(transaction);
});

router.put("/:id", [Auth, Admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id);
    if (!transaction)
      return res.status(404).send({
        success: false,
        message: "transaction could not be found",
      });
    res.send(transaction);
  } catch (e) {
    debug(e);
    return res.send({
      status: false,
      message: "There was an error",
    });
  }
});

router.delete("/:id", [Auth, Admin], async (req, res) => {
  const transaction = await Transaction.findByIdAndRemove(req.params.id);
  if (!transaction)
    return res
      .status(404)
      .send({ success: false, message: "transaction could not be found" });

  res.status(200).send(transaction);
});

module.exports = router;
