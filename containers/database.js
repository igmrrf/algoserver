const mongoose = require("mongoose");
const winston = require("winston");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://trender:trender@bivest-xas6e.mongodb.net/bcmt?retryWrites=true&w=majority",
      {
        serverSelectionTimeoutMS: 5000,
      }
    )
    .then(() => winston.info("Successful Connection to database"));
};
