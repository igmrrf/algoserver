const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const url = config.get("db_url") || process.env.DATABASE_URL;

console.log(url);
module.exports = function () {
  mongoose
    .connect(url, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => winston.info("Successful Connection to database"));
};
