import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.ts" // seed: "tsx prisma/seed.ts" - for local
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
