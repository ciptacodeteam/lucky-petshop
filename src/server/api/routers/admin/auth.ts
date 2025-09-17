import { auth } from "@/lib/auth";
import { z } from "@/lib/zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { BetterAuthError } from "better-auth";

export const adminAuthRouter = createTRPCRouter({
  checkAdminExist: publicProcedure
    .output(z.object({ exists: z.boolean() }).nullable())
    .query(async (): Promise<{ exists: boolean } | null> => {
      try {
        const admins = await db.user.findMany({
          where: {
            role: "admin",
          },
          select: {
            id: true,
          },
        });

        if (!admins || admins.length === 0) {
          return { exists: false };
        }

        return { exists: true };
      } catch (error) {
        console.error("Check admin account failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check admin account",
          cause: error,
        });
      }
    }),

  registerAdmin: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        email: z.email(),
        password: z.string().min(6).max(35),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const existingAdmin = await db.user.findFirst({
          where: { email: input.email, role: "admin" },
        });

        if (existingAdmin) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email sudah terdaftar sebagai admin",
          });
        }

        const session = await auth.api.createUser({
          body: {
            name: input.name,
            email: input.email,
            password: input.password,
            role: "admin",
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create admin account",
          });
        }

        return session?.user;
      } catch (error) {
        console.error("Failed to create admin account:", error);
        if (error instanceof BetterAuthError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal membuat akun admin",
          cause: error,
        });
      }
    }),

  loginAdmin: publicProcedure
    .input(
      z.object({
        email: z.email("Email atau password salah"),
        password: z.string().min(6).max(30, "Password maksimal 30 karakter"),
        rememberMe: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const session = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
            rememberMe: input.rememberMe,
          },
        });
        console.log("🚀 ~ session Login:", session);

        if (!session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email atau password salah",
          });
        }

        return session;
      } catch (error) {
        console.error("Admin login failed:", error);
        if (error instanceof BetterAuthError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal masuk sebagai admin",
          cause: error,
        });
      }
    }),
});
