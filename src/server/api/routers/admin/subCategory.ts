import { z } from "@/lib/zod";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";

export const adminSubCategoryRouter = createTRPCRouter({
  getAll: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.subCategory.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Get sub categories failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mendapatkan sub kategori",
      });
    }
  }),

  create: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        categoryId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, categoryId } = input;
        const slug = slugify(name, { lower: true, strict: true });

        const existingSubCategory = await ctx.db.subCategory.findFirst({
          where: { slug },
        });
        if (existingSubCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Sub kategori sudah ada",
          });
        }

        return await ctx.db.subCategory.create({
          data: {
            name,
            slug,
            categoryId,
          },
        });
      } catch (error) {
        console.error("Create sub category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal membuat sub kategori",
        });
      }
    }),

  delete: adminProtectedProcedure
    .input(z.uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const subCategory = await ctx.db.subCategory.findUnique({
          where: { id: input },
        });

        if (!subCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sub kategori tidak ditemukan",
          });
        }

        await ctx.db.subCategory.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        console.error("Delete sub category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal menghapus sub kategori",
        });
      }
    }),
});
