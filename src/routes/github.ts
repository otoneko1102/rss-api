import { Hono } from "hono";
import { Feed, serveFeed } from "hono-feed";
import ky, { HTTPError } from "ky";
import { API_DOMAIN } from "../lib/config.js";

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
}

const github = new Hono();

/**
 * GET /?user=USERNAME
 * Returns an RSS feed based on a list of public repository for GitHub users.
 */
github.get("/", async (c) => {
  const user = c.req.query("user");
  if (!user) {
    return c.json(
      {
        error:
          'Username is required. Please use the "user" query parameter (e.g., /api/github?user=USERNAME)',
      },
      400
    );
  }

  try {
    const feed = new Feed({
      title: `GitHub Repositories by ${user}`,
      description: `Latest public repositories by ${user} on GitHub.`,
      feedUrl: `${API_DOMAIN}/api/github?user=${user}`,
      link: `https://github.com/${user}`,
      language: "en",
    });

    const url = `https://api.github.com/users/${user}/repos?sort=updated&direction=desc`;
    const data = await ky
      .get(url, { headers: { "User-Agent": "RSS-API" } })
      .json<GitHubRepo[]>();

    for (const repo of data) {
      const updatedAt = new Date(repo.updated_at);

      const year = updatedAt.getUTCFullYear();
      const month = String(updatedAt.getUTCMonth() + 1).padStart(2, "0");
      const day = String(updatedAt.getUTCDate()).padStart(2, "0");
      const hours = String(updatedAt.getUTCHours()).padStart(2, "0");
      const minutes = String(updatedAt.getUTCMinutes()).padStart(2, "0");
      const seconds = String(updatedAt.getUTCSeconds()).padStart(2, "0");
      const timestamp = `${year}${month}${day}.${hours}${minutes}${seconds}`;

      feed.addItem({
        title: `${repo.name} v${timestamp}`,
        description: repo.description ?? "No description provided.",
        link: `${repo.html_url}?updated_at=${repo.updated_at}`,
        id: `${repo.id}@${repo.updated_at}`,
        published: updatedAt,
      });
    }

    return serveFeed(c, feed);
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error("Failed to fetch from GitHub API:", error.message);
    } else {
      console.error("Failed to generate RSS feed:", error);
    }
    return c.json({ error: "Error generating RSS feed" }, 500);
  }
});

export default github;
