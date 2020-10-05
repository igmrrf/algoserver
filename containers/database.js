const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const url =
  process.env.NODE_ENV === "production"
    ? config.get("db_url") || process.env.DATABASE_URL
    : "mongodb://localhost:27017/bcmt";

console.log(url);
module.exports = function () {
  mongoose
    .connect(url, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => winston.info("Successful Connection to database"));
};
