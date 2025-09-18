import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { admin, bearer, jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  advanced: {
    cookies: {
      session_token: {
        name: env.SESSION_COOKIE_NAME || "session_token",
        attributes: {
          httpOnly: true,
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 35,
  },
  plugins: [
    admin({
      adminRoles: ["admin", "user"],
      defaultRole: "user",
    }),
    inferAdditionalFields({
      user: {
        // Add any additional fields you want to infer
      },
    }),
    bearer(),
    jwt(),
    nextCookies(),
  ],
});
