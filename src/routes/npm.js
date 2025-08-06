const express = require("express");
const RSS = require("rss");
const fetch = require("node-fetch");
const { API_DOMAIN } = require("../lib/config");
const router = express.Router();

/**
 * GET /?user=USERNAME&language=LANGUAGE
 * Returns an RSS feed of a user's NPM packages.
 */
router.get("/", async (req, res) => {
  try {
    const { user, language } = req.query;
    if (!user) {
      return res.status(400).json({
        error:
          'Username is required. Please use the "user" query parameter (e.g., /api/npm?user=USERNAME)',
      });
    }

    const feed = new RSS({
      title: `NPM Packages by ${user}`,
      description: `Latest packages published by ${user} on npm.`,
      feed_url: `${API_DOMAIN}/api/npm?id=${user}`,
      site_url: `https://www.npmjs.com/~${user}`,
      language: language || "en",
    });

    const url = `https://registry.npmjs.org/-/v1/search?text=author:${user}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from NPM registry: ${response.statusText}`
      );
    }
    const data = await response.json();

    if (data.objects) {
      for (const obj of data.objects) {
        feed.item({
          title: `${obj.package.name} v${obj.package.version}`,
          description: obj.package.description || "No description provided.",
          url: obj.package.links.npm,
          guid: `${obj.package.name}@${obj.package.version}`,
          date: new Date(obj.package.date),
        });
      }
    }

    const xml = feed.xml({ indent: true });
    res.type("application/rss+xml").send(xml);
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    res.status(500).json({ error: "Error generating RSS feed" });
  }
});

module.exports = router;
