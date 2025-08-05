const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    // - Ignore not directory
    // - Ignore hidden file
    // - Ignore api.js
    // - Ignore not .js
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // e.g. "npm.js" -> "npm"
    const routeName = file.replace(".js", "");

    const route = require(path.join(__dirname, file));
    router.use(`/${routeName}`, route);
    console.log(`Route loaded: /api/${routeName}`);
  });

module.exports = router;
