import { config } from "dotenv";

if (process.env.NODE_ENV === "tst") {
  config({ path: ".env.tst" });
} else {
  config();
}

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "tst", "prd"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  // DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables!", _env.error.format());

  throw new Error("Invalid environment variables!");
}

export const env = _env.data;
