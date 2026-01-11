const envConfig = {
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  BUILD_VERSION:
    process.env.NEXT_PUBLIC_BUILD_VERSION || new Date().toISOString(),
};

export default envConfig;
