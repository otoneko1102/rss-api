import * as cheerio from "cheerio";
import { Hono } from "hono";
import { Feed, serveFeed } from "hono-feed";
import ky, { HTTPError } from "ky";
import { API_DOMAIN } from "../lib/config.js";

const FXTWITTER_BASE = "https://fxtwitter.com";

const twitter = new Hono();

/**
 * GET /?user=USERNAME[&count=N&with_replies=1&safe=1&lang=CODE&media=1]
 * Returns an RSS feed of a user's tweets via FxTwitter (fxtwitter.com).
 */
twitter.get("/", async (c) => {
  const user = c.req.query("user");
  if (!user) {
    return c.json(
      {
        error:
          'Username is required. Please use the "user" query parameter (e.g., /api/twitter?user=USERNAME)',
      },
      400
    );
  }

  const count = c.req.query("count");
  const withReplies = c.req.query("with_replies");
  const safe = c.req.query("safe");
  const lang = c.req.query("lang");
  const mediaOnly = c.req.query("media") === "1";

  try {
    const feedFile = mediaOnly ? "media.xml" : "feed.xml";
    const params = new URLSearchParams();
    if (count) params.set("count", count);
    if (withReplies === "1") params.set("with_replies", "1");
    if (safe === "1") params.set("safe", "1");
    if (lang) params.set("lang", lang);

    const qs = params.toString();
    const sourceUrl = `${FXTWITTER_BASE}/${user}/${feedFile}${qs ? `?${qs}` : ""}`;

    const xml = await ky
      .get(sourceUrl, { headers: { "User-Agent": "RSS-API" } })
      .text();

    const $ = cheerio.load(xml, { xmlMode: true });

    const feed = new Feed({
      title: $("channel > title").first().text() || `Tweets by @${user}`,
      description:
        $("channel > description").first().text() ||
        `Latest tweets by @${user} on X (Twitter).`,
      feedUrl: `${API_DOMAIN}/api/twitter?user=${user}`,
      link: `https://x.com/${user}`,
      language: lang ?? "en",
    });

    $("item").each((_, el) => {
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      const description = $(el).find("description").text();
      const guid = $(el).find("guid").text();

      feed.addItem({
        title: title || "Tweet",
        description: description || "",
        link: link || `https://x.com/${user}`,
        id: guid || link,
        published: pubDate ? new Date(pubDate) : new Date(),
      });
    });

    return serveFeed(c, feed, { pretty: true });
  } catch (error) {
    if (error instanceof HTTPError) {
      const status = error.response.status;
      if (status === 404) {
        return c.json({ error: `User "@${user}" not found.` }, 404);
      }
      console.error("Failed to fetch from FxTwitter:", error.message);
    } else {
      console.error("Failed to generate Twitter RSS feed:", error);
    }
    return c.json({ error: "Error generating RSS feed" }, 500);
  }
});

export default twitter;
