import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import MarkdownIt from "markdown-it";
import mdAttrs from "markdown-it-attrs";
import mdContainer from "markdown-it-container";
import { API_DOMAIN } from "./lib/config.js";
import api from "./routes/api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const md = new MarkdownIt({ html: true });
md.use(mdContainer, "description");
md.use(mdAttrs);

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

app.use("*", cors({ origin: "*" }));

app.get("/", (c) => {
  try {
    const htmlTemplate = readFileSync(join(publicDir, "base.html"), "utf-8");
    const markdownContent = readFileSync(join(publicDir, "index.md"), "utf-8");

    const finalMarkdownContent = markdownContent.replace(
      /%API_DOMAIN%/g,
      API_DOMAIN
    );

    const contentHtml = md.render(finalMarkdownContent);
    const finalHtml = htmlTemplate.replace(
      "<main></main>",
      `<main>${contentHtml}</main>`
    );

    return c.html(finalHtml);
  } catch (error) {
    console.error("Failed to render homepage:", error);
    return c.text("Error generating homepage", 500);
  }
});

app.route("/api", api);

app.use("/*", serveStatic({ root: "./public" }));

app.notFound((c) => c.json({ error: "Not Found" }, 404));

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
