/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    // NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // NEXT_PUBLIC_NOTION_CLIENT_ID: process.env.NOTION_CLIENT_ID,
    NEXT_PUBLIC_APP_ENV: process.env.APP_ENV || "production",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_BUILD_VERSION:
      process.env.NEXT_PUBLIC_BUILD_VERSION || new Date().toISOString(),
  },
};

module.exports = nextConfig;
