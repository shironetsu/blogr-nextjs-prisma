import { z } from "zod";

const developmentEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().min(1),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
});

const productionEnvSchema = developmentEnvSchema.extend({
  NEXTAUTH_SECRET: z.string().min(1),
});

const envSchema =
  process.env.NODE_ENV === "production"
    ? productionEnvSchema
    : developmentEnvSchema;

const env = envSchema.parse(process.env);
export default env;
