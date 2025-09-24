import { TRPCError } from "@trpc/server";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";
import { z } from "@/lib/zod";

export const adminProductTypeRouter = createTRPCRouter({
  getAll: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay

      return await ctx.db.productType.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Get product types failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mendapatkan jenis produk",
      });
    }
  }),

  create: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingType = await ctx.db.productType.findUnique({
          where: { name: input.name },
        });
        if (existingType) {
          throw new Error("Jenis produk sudah ada");
        }
        return await ctx.db.productType.create({
          data: { name: input.name },
        });
      } catch (error) {
        console.error("Create product type failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal membuat jenis produk",
        });
      }
    }),

  delete: adminProtectedProcedure
    .input(z.uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const existingType = await ctx.db.productType.findUnique({
          where: { id: input },
          //   include: { products: true },
        });
        if (!existingType) {
          throw new Error("Jenis produk tidak ditemukan");
        }
        // if (existingType.products.length > 0) {
        //   throw new TRPCError({
        //     code: "CONFLICT",
        //     message: "Jenis produk masih digunakan oleh produk lain",
        //   });
        // }
        await ctx.db.productType.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        console.error("Delete product type failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal menghapus jenis produk",
        });
      }
    }),
});
