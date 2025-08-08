const express = require("express");
const RSS = require("rss");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { API_DOMAIN } = require("../lib/config");
const router = express.Router();

/**
 * GET /?user=USERNAME
 * Returns an RSS feed of events a user has signed up for on connpass.
 */
router.get("/", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({
        error:
          'Username is required. Please use "user" query parameter (e.g., /api/connpass?user=USERNAME)',
      });
    }

    const url = `https://connpass.com/user/${user}/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from connpass: ${response.statusText}`
      );
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const feed = new RSS({
      title: `${user} のconnpass参加イベント一覧`,
      description: `${user} の参加イベント一覧です。`,
      feed_url: `${API_DOMAIN}/api/connpass?user=${user}`,
      site_url: url,
      language: "ja",
    });

    $(".event_list.vevent").each((i, el) => {
      const eventElement = $(el);

      const title = eventElement.find(".event_title a").text().trim();
      const eventUrl = eventElement.find(".event_title a").attr("href");
      const group = eventElement.find(".series_title").text().trim();
      const owner = eventElement
        .find(".event_owner")
        .text()
        .trim()
        .replace(/\s+/g, " ");
      const statusTags = eventElement
        .find(".event_label_area .label_status_tag")
        .map((i, tag) => $(tag).text().trim())
        .get();
      const dateStr = eventElement.find(".dtstart .value-title").attr("title");

      let description = "";
      if (group) description += `<b>団体:</b> ${group}<br>`;
      if (owner) description += `<b>主催:</b> ${owner}<br>`;
      if (statusTags.length > 0)
        description += `<b>ステータス:</b> ${statusTags.join(", ")}<br>`;

      feed.item({
        title: title,
        description: description,
        url: eventUrl,
        guid: eventUrl,
        date: dateStr ? new Date(dateStr) : new Date(),
      });
    });

    const xml = feed.xml({ indent: true });
    res.type("application/rss+xml").send(xml);
  } catch (error) {
    console.error("Failed to generate connpass RSS feed:", error);
    res.status(500).json({ error: "Error generating connpass RSS feed" });
  }
});

module.exports = router;
