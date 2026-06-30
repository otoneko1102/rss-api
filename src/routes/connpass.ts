import * as cheerio from "cheerio";
import { Hono } from "hono";
import { Feed, serveFeed } from "hono-feed";
import ky, { HTTPError } from "ky";
import { API_DOMAIN } from "../lib/config.js";

const connpass = new Hono();

/**
 * GET /?user=USERNAME
 * Returns an RSS feed of events a user has signed up for on connpass.
 */
connpass.get("/", async (c) => {
  const user = c.req.query("user");
  if (!user) {
    return c.json(
      {
        error:
          'Username is required. Please use "user" query parameter (e.g., /api/connpass?user=USERNAME)',
      },
      400
    );
  }

  try {
    const url = `https://connpass.com/user/${user}/`;
    const html = await ky.get(url).text();
    const $ = cheerio.load(html);

    const feed = new Feed({
      title: `${user} のconnpass参加イベント一覧`,
      description: `${user} の参加イベント一覧です。`,
      feedUrl: `${API_DOMAIN}/api/connpass?user=${user}`,
      link: url,
      language: "ja",
    });

    $(".event_list.vevent").each((_i, el) => {
      const eventElement = $(el);

      const title = eventElement.find(".event_title a").text().trim();
      const eventUrl = eventElement.find(".event_title a").attr("href") ?? "";
      const group = eventElement.find(".series_title").text().trim();
      const owner = eventElement
        .find(".event_owner")
        .text()
        .trim()
        .replace(/\s+/g, " ");
      const statusTags = eventElement
        .find(".event_label_area .label_status_tag")
        .map((_i, tag) => $(tag).text().trim())
        .get();
      const dateStr = eventElement.find(".dtstart .value-title").attr("title");

      let description = "";
      if (group) description += `<b>団体:</b> ${group}<br>`;
      if (owner) description += `<b>主催:</b> ${owner}<br>`;
      if (statusTags.length > 0)
        description += `<b>ステータス:</b> ${statusTags.join(", ")}<br>`;

      feed.addItem({
        title,
        description,
        link: eventUrl,
        id: eventUrl,
        published: dateStr ? new Date(dateStr) : new Date(),
      });
    });

    return serveFeed(c, feed, { pretty: true });
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error("Failed to fetch from connpass:", error.message);
    } else {
      console.error("Failed to generate connpass RSS feed:", error);
    }
    return c.json({ error: "Error generating connpass RSS feed" }, 500);
  }
});

export default connpass;
