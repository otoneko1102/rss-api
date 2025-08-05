require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const apiRoutes = require("./src/routes/api");

const app = express();
const port = process.env.PORT || 3000;

const MarkDownIt = require("markdown-it");
const mdContainer = require("markdown-it-container");

const md = MarkDownIt({ html: true });
md.use(mdContainer, "description");

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  try {
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "public", "base.html"),
      "utf-8"
    );
    const markdownContent = fs.readFileSync(
      path.join(__dirname, "public", "index.md"),
      "utf-8"
    );

    const contentHtml = md.render(markdownContent);

    const finalHtml = htmlTemplate.replace(
      "<main></main>",
      `<main>${contentHtml}</main>`
    );

    res.send(finalHtml);
  } catch (error) {
    console.error("Failed to render homepage:", error);
    res.status(500).send("Error generating homepage");
  }
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
