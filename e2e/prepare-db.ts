import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

const DATABASE_URL = "file:./data/e2e.db";

// runs before the e2e server boots, so every run starts empty
for (const suffix of ["", "-shm", "-wal"]) {
  rmSync(`data/e2e.db${suffix}`, { force: true });
}

execSync("npm run db:migrate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL, DATABASE_AUTH_TOKEN: "" },
});
