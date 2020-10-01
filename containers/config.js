const debug = require("debug")("app:config");
const config = require("config");
const morgan = require("morgan");

module.exports = function (app) {
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan Enabled");
    debug(config.get("vividly_jwtkey"));
    debug(config.get("db_url"));
    debug(process.env.DATABASE_URL);
  }
};
