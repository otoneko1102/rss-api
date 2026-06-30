import "dotenv/config";

export const API_DOMAIN =
  process.env.DOMAIN ?? `http://localhost:${process.env.PORT ?? 3000}`;
