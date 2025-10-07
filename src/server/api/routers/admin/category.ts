import { z } from "@/lib/zod";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";

export const adminCategoryRouter = createTRPCRouter({
  getAll: adminProtectedProcedure
    .input(
      z
        .object({
          includeSubCategories: z.boolean().optional().default(false),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { includeSubCategories } = input || {};
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
    .input(z.string())
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
        slug: z.string().optional(),
        subCategories: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCategory = await ctx.db.category.findFirst({
          where: { OR: [{ name: input.name }, { slug: input.slug }] },
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

        let slug = input.slug;
        if (!slug) {
          slug = slugify(input.name, { lower: true, strict: true });
        }

        // Create the category first
        const category = await ctx.db.category.create({
          data: {
            name: input.name,
            slug: slug,
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
        id: z.string(),
        name: z.string().min(2).max(50),
        slug: z.string().optional(),
        subCategories: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .$transaction(async (tx) => {
          const category = await tx.category.findUnique({
            where: { id: input.id },
          });
          if (!category)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Kategori tidak ditemukan",
            });

          let slug =
            input.slug ?? slugify(input.name, { lower: true, strict: true });
          if (slug !== category.slug) {
            let suffix = 1;
            const base = slug;
            while (
              await tx.category.findFirst({
                where: { slug, NOT: { id: input.id } },
                select: { id: true },
              })
            ) {
              suffix += 1;
              slug = `${base}-${suffix}`;
            }
          }

          // Normalize names (trim + lower for matching)
          const rawIds = [
            ...new Set(
              input.subCategories?.map((n) => n.trim()).filter(Boolean),
            ),
          ];

          // Find existing by name (case-insensitive)
          const existing = await tx.subCategory.findMany({
            where: { id: { in: rawIds, mode: "insensitive" } },
            select: { id: true, name: true },
          });

          if (existing.length !== rawIds.length) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Beberapa nama sub kategori tidak ditemukan",
            });
          }

          // Replace all links with `set`
          return tx.category.update({
            where: { id: input.id },
            data: {
              name: input.name,
              slug,
              subCategories: { set: existing.map((a) => ({ id: a.id })) },
            },
            include: { subCategories: true },
          });
        })
        .catch((err) => {
          // If unique constraints still race, P2002 bubbles here
          console.error("Update category failed:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              err instanceof Error ? err.message : "Gagal memperbarui kategori",
          });
        });
    }),

  delete: adminProtectedProcedure
    .input(z.string())
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

        await ctx.db.$transaction(async (tx) => {
          await tx.subCategory.deleteMany({
            where: { category: { some: { id: input } } },
          });

          await tx.category.delete({
            where: { id: input },
          });
        });

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
