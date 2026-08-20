import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1).default("file:./data/refunds.db"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${z.prettifyError(parsed.error)}`);
}

// the file default is a convenience for local work only — a serverless filesystem is
// read-only, so falling back to it in production fails later and less clearly
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Set it explicitly in production — on a serverless host use a libsql:// URL with DATABASE_AUTH_TOKEN, and on a server point it at a file on a persistent volume.",
  );
}

export const env = parsed.data;
