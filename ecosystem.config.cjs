require("dotenv").config();

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME ?? "rss-api",
      script: "./dist/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
