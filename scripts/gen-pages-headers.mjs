import { mkdirSync, writeFileSync } from "node:fs";
import env from "../src/config/env.js";

const isProd = env.APP_ENV === "production";

// Allow framing from Notion and self
const frameAncestors = [
  "'self'",
  "https://www.notion.so",
  "https://notion.so",
  "https://*.notion.site",
];

// Allow framing from localhost in development
if (!isProd) {
  frameAncestors.push("http://localhost:5000", "http://127.0.0.1:5000");
}

const csp = `frame-ancestors ${frameAncestors.join(" ")};`;

const content = `/*
  Content-Security-Policy: ${csp}
`;

// Ensure public exists
mkdirSync("public", { recursive: true });

// Write public/_headers for Cloudflare Pages
writeFileSync("public/_headers", content, "utf8");

console.log(
  `[gen-pages-headers] Wrote public/_headers (env=${
    isProd ? "prod" : "non-prod"
  })`,
);
