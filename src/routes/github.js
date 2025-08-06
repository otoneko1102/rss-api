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

    const reposUrl = `https://api.github.com/users/${user}/repos?sort=updated&direction=desc`;
    const reposResponse = await fetch(reposUrl, {
      headers: { "User-Agent": "RSS-API-Server" },
    });

    if (!reposResponse.ok) {
      throw new Error(
        `Failed to fetch data from GitHub API: ${reposResponse.statusText}`
      );
    }

    const repos = await reposResponse.json();

    const feed = new RSS({
      title: `GitHub Repositories by ${user}`,
      description: `Latest public repositories by ${user} on GitHub.`,
      feed_url: `${API_DOMAIN}/api/github?user=${user}`,
      site_url: `https://github.com/${user}`,
      language: language || "en",
    });

    for (const repo of repos) {
      const updatedAt = new Date(repo.updated_at);

      const year = updatedAt.getUTCFullYear();
      const month = String(updatedAt.getUTCMonth() + 1).padStart(2, "0");
      const day = String(updatedAt.getUTCDate()).padStart(2, "0");
      const hours = String(updatedAt.getUTCHours()).padStart(2, "0");
      const minutes = String(updatedAt.getUTCMinutes()).padStart(2, "0");
      const seconds = String(updatedAt.getUTCSeconds()).padStart(2, "0");
      const timestamp = `${year}${month}${day}.${hours}${minutes}${seconds}`;

      const title = `${repo.name}@${timestamp}`;

      feed.item({
        title: title,
        description: repo.description || "No description provided.",
        url: repo.html_url,
        guid: `${repo.id}-${repo.updated_at}`,
        date: updatedAt,
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
