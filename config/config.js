require("dotenv").config();

const configurations = {
  port: process.env.PORT || 5000,
  jwt: process.env.JWT_SECRET_KEY,
  db_url: process.env.DATABASE_URL,
};

module.exports = configurations;
