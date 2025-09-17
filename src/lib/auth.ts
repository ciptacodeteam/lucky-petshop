import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { admin, jwt } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  plugins: [admin(), jwt(), nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
});
