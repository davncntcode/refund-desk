import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1).default("file:./data/refunds.db"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
