const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

// ? Configuring winston to handle uncaught errors
module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaught.log" })
  );
  // ? Throwing unhandled rejections to uncaught errors
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // ? Setting up winston
  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: config.get("db_url"),
  //   level: "info",
  // });
};
