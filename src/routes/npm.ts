import { Hono } from "hono";
import { Feed, toRSS } from "hono-feed";
import ky, { HTTPError } from "ky";
import { API_DOMAIN } from "../lib/config.js";

interface NpmPackage {
  name: string;
  version: string;
  description: string;
  date: string;
  links: { npm: string };
}

interface NpmSearchResponse {
  objects: Array<{ package: NpmPackage }>;
}

const npm = new Hono();

/**
 * GET /?user=USERNAME
 * Returns an RSS feed of a user's NPM packages.
 */
npm.get("/", async (c) => {
  const user = c.req.query("user");
  if (!user) {
    return c.json(
      {
        error:
          'Username is required. Please use the "user" query parameter (e.g., /api/npm?user=USERNAME)',
      },
      400
    );
  }

  try {
    const feed = new Feed({
      title: `NPM Packages by ${user}`,
      description: `Latest packages published by ${user} on npm.`,
      feedUrl: `${API_DOMAIN}/api/npm?id=${user}`,
      link: `https://www.npmjs.com/~${user}`,
      language: "en",
    });

    const url = `https://registry.npmjs.org/-/v1/search?text=author:${user}`;
    const data = await ky.get(url).json<NpmSearchResponse>();

    for (const obj of data.objects) {
      feed.addItem({
        title: `${obj.package.name} v${obj.package.version}`,
        description: obj.package.description ?? "No description provided.",
        link: `${obj.package.links.npm}/v/${obj.package.version}/`,
        id: `${obj.package.name}@${obj.package.version}`,
        published: new Date(obj.package.date),
      });
    }

    const xml = toRSS(feed.toInput(), { pretty: true });
    return c.body(xml, 200, { "Content-Type": "application/rss+xml" });
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error("Failed to fetch from NPM registry:", error.message);
    } else {
      console.error("Failed to generate RSS feed:", error);
    }
    return c.json({ error: "Error generating RSS feed" }, 500);
  }
});

export default npm;
