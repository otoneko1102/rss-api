const express = require("express");
const RSS = require("rss");
const fetch = require("node-fetch");
const { API_DOMAIN } = require("../lib/config");
const router = express.Router();

/**
 * GET /?user=USERNAME&language=LANGUAGE
 * Returns an RSS feed based on a list of public repository for GitHub users.
 */
router.get("/", async (req, res) => {
  try {
    const { user, language } = req.query;
    if (!user) {
      return res.status(400).json({
        error:
          'Username is required. Please use "user" query parameter (e.g., /api/github?user=USERNAME)',
      });
    }

    const url = `https://api.github.com/users/${user}/repos?sort=pushed&direction=desc`;
    const response = await fetch(url, {
      headers: { "User-Agent": "RSS-API-Server" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from GitHub API: ${response.statusText}`
      );
    }
    const repos = await response.json();

    const feed = new RSS({
      title: `GitHub Repositories by ${user}`,
      description: `Latest public repositories by ${user} on GitHub.`,
      feed_url: `${API_DOMAIN}/api/github?user=${user}`,
      site_url: `https://github.com/${user}`,
      language: language || "en",
    });

    for (const repo of repos) {
      feed.item({
        title: repo.name,
        description: repo.description || "No description provided.",
        url: repo.html_url,
        guid: repo.id,
        date: new Date(repo.pushed_at),
      });
    }

    const xml = feed.xml({ indent: true });
    res.type("application/rss+xml").send(xml);
  } catch (error) {
    console.error("Failed to generate GitHub RSS feed:", error);
    res.status(500).json({ error: "Error generating GitHub RSS feed" });
  }
});

module.exports = router;
