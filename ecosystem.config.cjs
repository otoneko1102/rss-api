require("dotenv").config();

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME ?? "rss-api",
      script: "./src/server.ts",
      interpreter: "./node_modules/.bin/tsx",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
