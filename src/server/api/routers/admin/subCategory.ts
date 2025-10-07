import { z } from "@/lib/zod";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";

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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .$transaction(async (tx) => {
          const { id, name } = input;

          const subCategory = await tx.subCategory.findUnique({
            where: { id },
          });

          if (!subCategory) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Sub Kategori tidak ditemukan",
            });
          }

          let slug =
            input.slug ?? slugify(input.name, { lower: true, strict: true });
          if (slug !== subCategory.slug) {
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

          const existingSubCategory = await tx.subCategory.findFirst({
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

          return await tx.subCategory.update({
            where: { id },
            data: {
              name,
              slug,
            },
          });
        })
        .catch((error) => {
          console.error("Update sub category failed:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Gagal memperbarui sub kategori",
          });
        });
    }),

  create: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        slug: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name } = input;
        let slug =
          input.slug ?? slugify(input.name, { lower: true, strict: true });

        // Pastikan slug unik
        let suffix = 1;
        const base = slug;
        while (
          await ctx.db.subCategory.findFirst({
            where: { slug },
            select: { id: true },
          })
        ) {
          suffix += 1;
          slug = `${base}-${suffix}`;
        }

        const existingSubCategory = await ctx.db.subCategory.findFirst({
          where: { OR: [{ name }, { slug }] },
        });

        if (existingSubCategory) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Sub Kategori dengan nama atau slug tersebut sudah ada",
          });
        }

        return await ctx.db.subCategory.create({
          data: {
            name,
            slug,
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

        // Optional: Cek apakah sub kategori ini masih digunakan di produk
        const linkedProducts = await ctx.db.product.findFirst({
          where: { subCategoryId: input },
          select: { id: true },
        });
        if (linkedProducts) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Sub Kategori ini masih digunakan di produk. Hapus atau ubah produk terkait terlebih dahulu.",
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
