import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { sendForgotPasswordEmail } from "./emails";

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
    sendResetPassword: async ({ user, token, url }) => {
      console.log("🚀 ~ url:", url);
      // extract callbackURL from url and check if callbackURL is contains /admin/auth/reset-password
      const urlDecoded = decodeURIComponent(url);
      const urlObj = new URL(urlDecoded);
      const callbackURL = urlObj.searchParams.get("callbackURL") || "";

      let redirectTo = "/admin/auth/reset-password";
      if (!callbackURL.includes("/admin/auth/reset-password")) {
        redirectTo = "/auth/reset-password";
      } else {
        redirectTo = callbackURL;
      }

      await sendForgotPasswordEmail({
        to: user.email,
        data: {
          user_name: user.name || user.email,
          support_email: env.SUPPORT_EMAIL || "support@example.com",
        },
        url: `${env.BETTER_AUTH_URL}${redirectTo}?token=${token}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
    resetPasswordTokenExpiresIn: 5 * 60, // 5 minutes
  },
  plugins: [
    admin({
      adminRoles: ["admin", "user"],
      defaultRole: "user",
    }),
    inferAdditionalFields({
      user: {
        // Add any additional fields you want to infer
        role: {
          type: "string",
          isRequired: true,
        },
        banned: {
          type: "boolean",
          isRequired: true,
          defaultValue: false,
        },
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
