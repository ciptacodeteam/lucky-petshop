import { z } from "@/lib/zod";
import { TRPCError } from "@trpc/server";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";

export const adminAnnouncementRouter = createTRPCRouter({
  getAll: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.announcement.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Get announcements failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mendapatkan pengumuman",
      });
    }
  }),

  create: adminProtectedProcedure
    .input(
      z.object({
        content: z.string().min(2).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { content } = input;

        const existingannouncement = await ctx.db.announcement.findFirst({
          where: { content: content },
        });
        if (existingannouncement) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Pengumuman sudah ada",
          });
        }

        return await ctx.db.announcement.create({
          data: {
            content,
          },
        });
      } catch (error) {
        console.error("Create sub category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Gagal membuat pengumuman",
        });
      }
    }),

  delete: adminProtectedProcedure
    .input(z.uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const announcement = await ctx.db.announcement.findUnique({
          where: { id: input },
        });

        if (!announcement) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Pengumuman tidak ditemukan",
          });
        }

        await ctx.db.announcement.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        console.error("Delete announcement failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal menghapus pengumuman",
        });
      }
    }),
});
