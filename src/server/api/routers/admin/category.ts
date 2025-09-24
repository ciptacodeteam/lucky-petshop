import { z } from "@/lib/zod";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";

export const adminCategoryRouter = createTRPCRouter({
  getAll: adminProtectedProcedure
    .input(
      z.object({
        includeSubCategories: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { includeSubCategories } = input;
        return await ctx.db.category.findMany({
          include: includeSubCategories ? { subCategories: true } : undefined,
          orderBy: { name: "asc" },
        });
      } catch (error) {
        console.error("Get categories failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal mendapatkan kategori",
        });
      }
    }),

  getById: adminProtectedProcedure
    .input(z.uuid())
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.findUnique({
          where: { id: input },
          include: { subCategories: true },
        });
        if (!category) {
          throw new Error("Kategori tidak ditemukan");
        }
        return category;
      } catch (error) {
        console.error("Get category by ID failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal mendapatkan kategori berdasarkan ID",
        });
      }
    }),

  create: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        subCategories: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCategory = await ctx.db.category.findFirst({
          where: { name: input.name },
        });

        if (existingCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nama kategori sudah ada",
          });
        }
        // Filter out subCategories that already exist for this category
        // Filter out subCategories that already exist (case-insensitive)
        let uniqueSubCategories: string[] = [];

        if (input.subCategories?.length) {
          const existingSubCategories = await ctx.db.subCategory.findMany({
            where: {
              name: {
                in: input.subCategories,
                mode: "insensitive",
              },
            },
            select: { name: true },
          });

          const existingNames = new Set(
            existingSubCategories.map((sc) => sc.name.toLowerCase()),
          );

          uniqueSubCategories = input.subCategories.filter(
            (name) => !existingNames.has(name.toLowerCase()),
          );
        }

        // Create the category first
        const category = await ctx.db.category.create({
          data: {
            name: input.name,
            slug: slugify(input.name, { lower: true, strict: true }),
          },
        });

        // Create unique subcategories and connect them to the category
        if (uniqueSubCategories.length) {
          await ctx.db.subCategory.createMany({
            data: uniqueSubCategories.map((name) => ({
              name,
              slug: slugify(name, { lower: true, strict: true }),
              categoryId: category.id,
            })),
            skipDuplicates: true,
          });
        }

        // Return the created category with its subcategories
        return ctx.db.category.findUnique({
          where: { id: category.id },
          include: { subCategories: true },
        });
      } catch (error) {
        console.error("Create category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Gagal membuat kategori",
        });
      }
    }),

  update: adminProtectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        name: z.string().min(2).max(50),
        subCategories: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.findUnique({
          where: { id: input.id },
        });
        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kategori tidak ditemukan",
          });
        }

        const existingCategory = await ctx.db.category.findFirst({
          where: { name: input.name, NOT: { id: input.id } },
        });

        if (existingCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nama kategori sudah ada",
          });
        }

        // Update the category name and slug
        const updatedCategory = await ctx.db.category.update({
          where: { id: input.id },
          data: {
            name: input.name,
            slug: slugify(input.name, { lower: true, strict: true }),
          },
        });

        // If subCategories are provided, handle them
        if (input.subCategories) {
          // Fetch existing subcategories for this category
          const existingSubCategories = await ctx.db.subCategory.findMany({
            where: { categoryId: input.id },
            select: { name: true },
          });

          const existingNames = new Set(
            existingSubCategories.map((sc) => sc.name.toLowerCase()),
          );
          // Filter out subCategories that already exist (case-insensitive)
          const uniqueSubCategories = input.subCategories.filter(
            (name) => !existingNames.has(name.toLowerCase()),
          );

          // Create unique subcategories and connect them to the category
          if (uniqueSubCategories.length) {
            await ctx.db.subCategory.createMany({
              data: uniqueSubCategories.map((name) => ({
                name,
                slug: slugify(name, { lower: true, strict: true }),
                categoryId: input.id,
              })),
              skipDuplicates: true,
            });
          }
        }

        return updatedCategory;
      } catch (error) {
        console.error("Update category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal memperbarui kategori",
        });
      }
    }),

  delete: adminProtectedProcedure
    .input(z.uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.findUnique({
          where: { id: input },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kategori tidak ditemukan",
          });
        }

        await Promise.all([
          ctx.db.subCategory.deleteMany({
            where: { categoryId: input },
          }),
          ctx.db.category.delete({
            where: { id: input },
          }),
        ]);

        return { success: true };
      } catch (error) {
        console.error("Delete category failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Gagal menghapus kategori",
        });
      }
    }),
});
