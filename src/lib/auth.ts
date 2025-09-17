import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { admin, jwt } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  plugins: [admin(), jwt()],
  emailAndPassword: {
    enabled: true,
  },
});
