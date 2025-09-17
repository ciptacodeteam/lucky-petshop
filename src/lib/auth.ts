import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { admin, jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 35,
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
    inferAdditionalFields({
      user: {
        // Add any additional fields you want to infer
      },
    }),
    jwt(),
    nextCookies(),
  ],
});
