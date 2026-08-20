import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// an explicit env var wins, otherwise fall back to .env.local
if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.DATABASE_URL ?? "file:./data/refunds.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

// a local file needs no token, a remote libsql database does
export default authToken
  ? defineConfig({
      dialect: "turso",
      schema: "./lib/db/schema.ts",
      out: "./drizzle",
      dbCredentials: { url, authToken },
    })
  : defineConfig({
      dialect: "sqlite",
      schema: "./lib/db/schema.ts",
      out: "./drizzle",
      dbCredentials: { url },
    });
