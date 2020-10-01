const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const ContactRoutes = require("../routes/contact");
const SupportRoutes = require("../routes/support");
const TransactionRoutes = require("../routes/transaction");
const UserRoutes = require("../routes/users");
const AuthRoutes = require("../routes/auth");
const BankRoutes = require("../routes/bank");
const Index = require("../routes");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors({ exposedHeaders: "x-auth-token" }));
  app.use(express.static("public"));
  app.use("/", Index);
  app.use("/api/contact", ContactRoutes);
  app.use("/api/support", SupportRoutes);
  app.use("/api/transactions", TransactionRoutes);
  app.use("/api/users", UserRoutes);
  app.use("/api/banks", BankRoutes);
  app.use("/api/auth", AuthRoutes);
  app.use(error);
};
