const express = require("express");
const RSS = require("rss");
const router = express.Router();
const fetch = require("node-fetch");

const API_DOMAIN =
  process.env.DOMAIN || `http://localhost:${process.env.PORT || 3000}`;

/**
 * GET /?id=USERNAME
 * Returns an RSS feed of a user's NPM packages.
 */
router.get("/", async (req, res) => {
  try {
    const username = req.query.id;
    if (!username) {
      return res.status(400).json({
        error:
          'Username is required. Please use the "id" query parameter (e.g., /api/npm?id=USERNAME)',
      });
    }

    const feed = new RSS({
      title: `NPM Packages by ${username}`,
      description: `Latest packages published by ${username} on npm.`,
      feed_url: `${API_DOMAIN}/api/npm?id=${username}`,
      site_url: `https://www.npmjs.com/~${username}`,
      language: "ja",
    });

    const url = `https://registry.npmjs.org/-/v1/search?text=author:${username}`;
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
