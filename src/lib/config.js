require("dotenv").config();

module.exports = {
  API_DOMAIN:
    process.env.DOMAIN || `http://localhost:${process.env.PORT || 3000}`,
};
