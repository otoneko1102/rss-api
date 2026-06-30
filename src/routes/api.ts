import { Hono } from "hono";
import connpass from "./connpass.js";
import github from "./github.js";
import npm from "./npm.js";
import twitter from "./twitter.js";

const api = new Hono();

api.route("/github", github);
api.route("/npm", npm);
api.route("/connpass", connpass);
api.route("/twitter", twitter);

console.log("Routes loaded");

export default api;
