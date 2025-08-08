const express = require("express");
const RSS = require("rss");
const fetch = require("node-fetch");
const { API_DOMAIN } = require("../lib/config");
const router = express.Router();

/**
 * GET /?user=USERNAME
 * Returns an RSS feed based on a list of public repository for GitHub users.
 */
router.get("/", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({
        error:
          'Username is required. Please use the "user" query parameter (e.g., /api/github?user=USERNAME)',
      });
    }

    const feed = new RSS({
      title: `GitHub Repositories by ${user}`,
      description: `Latest public repositories by ${user} on GitHub.`,
      feed_url: `${API_DOMAIN}/api/github?user=${user}`,
      site_url: `https://github.com/${user}`,
      language: "en",
    });

    const url = `https://api.github.com/users/${user}/repos?sort=updated&direction=desc`;
    const response = await fetch(url, {
      headers: { "User-Agent": "RSS-API" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from GitHub API: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data) {
      for (const obj of data) {
        const updatedAt = new Date(obj.updated_at);

        const year = updatedAt.getUTCFullYear();
        const month = String(updatedAt.getUTCMonth() + 1).padStart(2, "0");
        const day = String(updatedAt.getUTCDate()).padStart(2, "0");
        const hours = String(updatedAt.getUTCHours()).padStart(2, "0");
        const minutes = String(updatedAt.getUTCMinutes()).padStart(2, "0");
        const seconds = String(updatedAt.getUTCSeconds()).padStart(2, "0");
        const timestamp = `${year}${month}${day}.${hours}${minutes}${seconds}`;

        const title = `${obj.name} v${timestamp}`;

        feed.item({
          title: title,
          description: obj.description || "No description provided.",
          url: `${obj.html_url}?updated_at=${obj.updated_at}`,
          guid: `${obj.id}@${obj.updated_at}`,
          date: updatedAt,
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
