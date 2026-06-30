import { Hono } from "hono";
import github from "./github.js";
import npm from "./npm.js";
import connpass from "./connpass.js";

const api = new Hono();

api.route("/github", github);
api.route("/npm", npm);
api.route("/connpass", connpass);

console.log("Routes loaded: /api/github, /api/npm, /api/connpass");

export default api;
