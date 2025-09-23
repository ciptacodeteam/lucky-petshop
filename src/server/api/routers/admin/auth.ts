import { auth } from "@/lib/auth";
import { z } from "@/lib/zod";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { APIError, BetterAuthError } from "better-auth";

export const adminAuthRouter = createTRPCRouter({
  checkAccountExist: publicProcedure
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

  register: publicProcedure
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

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const res = await auth.api.signOut({
        headers: ctx.headers,
      });
      return { success: res?.success || false };
    } catch (error) {
      console.error("Admin logout failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal keluar dari admin",
        cause: error,
      });
    }
  }),

  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email tidak valid"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await auth.api.requestPasswordReset({
          body: {
            email: input.email,
            redirectTo: `/admin/auth/reset-password`,
          },
        });
        return { success: true };
      } catch (error) {
        console.error("Request password reset failed:", error);
        if (error instanceof APIError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengirim email reset password",
          cause: error,
        });
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Token diperlukan"),
        password: z.string().min(6).max(35),
        confirmPassword: z.string().min(6).max(35),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password dan konfirmasi password tidak sesuai",
        });
      }

      try {
        const session = await auth.api.resetPassword({
          headers: ctx.headers,
          body: {
            token: input.token,
            newPassword: input.password,
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Gagal mereset password",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Reset password failed:", error);
        if (error instanceof BetterAuthError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mereset password",
          cause: error,
        });
      }
    }),

  changePassword: adminProtectedProcedure
    .input(
      z.object({
        oldPassword: z.string().min(6).max(32),
        password: z.string().min(6).max(32),
        confirmPassword: z.string().min(6).max(32),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kata sandi dan konfirmasi kata sandi tidak sesuai",
        });
      }

      try {
        await auth.api.changePassword({
          headers: ctx.headers,
          body: {
            currentPassword: input.oldPassword,
            newPassword: input.password,
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Change password failed:", error);
        if (error instanceof BetterAuthError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengganti kata sandi",
          cause: error,
        });
      }
    }),
});
