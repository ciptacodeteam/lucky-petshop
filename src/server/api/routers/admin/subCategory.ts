import { z } from "@/lib/zod";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import type { Prisma } from "@prisma/client";

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

  getById: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const subCategory = await ctx.db.subCategory.findUnique({
          where: { id: input },
          include: { category: true },
        });
        if (!subCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sub Kategori tidak ditemukan",
          });
        }
        return subCategory;
      } catch (error) {
        console.error("Get sub category by ID failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal mendapatkan sub kategori berdasarkan ID",
        });
      }
    }),

  update: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(50),
        slug: z.string().optional().nullable(),
        categoryId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, name, categoryId } = input;
        let slug = input.slug;
        if (!slug) {
          slug = slugify(input.name, { lower: true, strict: true });
        }

        const subCategory = await ctx.db.subCategory.findUnique({
          where: { id },
        });
        if (!subCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sub Kategori tidak ditemukan",
          });
        }

        const existingSubCategory = await ctx.db.subCategory.findFirst({
          where: {
            OR: [{ name }, { slug }],
            NOT: { id },
          },
        });
        if (existingSubCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Sub Kategori dengan nama atau slug tersebut sudah ada",
          });
        }

        let data: Prisma.SubCategoryUpdateInput = {
          name,
          slug,
        };

        if (categoryId) {
          data = { ...data, category: { connect: { id: categoryId } } };
        } else {
          data = { ...data, category: { disconnect: true } };
        }

        return await ctx.db.subCategory.update({
          where: { id },
          data,
        });
      } catch (error) {
        console.error("Update sub category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal memperbarui sub kategori",
        });
      }
    }),

  create: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        slug: z.string().optional(),
        categoryId: z.uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, categoryId } = input;
        let slug = input.slug;
        if (!slug) {
          slug = slugify(input.name, { lower: true, strict: true });
        }

        const existingSubCategory = await ctx.db.subCategory.findFirst({
          where: { OR: [{ name }, { slug }] },
        });
        console.log(
          "🚀 ~ existingSubCategory:",
          existingSubCategory,
          categoryId,
        );
        if (existingSubCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Sub Kategori dengan nama atau slug tersebut sudah ada",
          });
        }

        let data: Prisma.SubCategoryCreateInput = {
          name,
          slug,
        };

        if (categoryId) {
          data = { ...data, category: { connect: { id: categoryId } } };
        }

        return await ctx.db.subCategory.create({
          data,
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
    .input(z.string())
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
