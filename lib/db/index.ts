import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/lib/env";
import * as schema from "./schema";

function connect() {
  if (env.DATABASE_URL.startsWith("file:")) {
    // libsql will not create the folder itself
    mkdirSync(dirname(env.DATABASE_URL.slice(5)) || ".", { recursive: true });
  }

  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof connect> };

// one connection survives dev hot reloads
export const db = globalForDb.db ?? connect();

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
