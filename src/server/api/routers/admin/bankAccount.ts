import { z } from "@/lib/zod";
import { TRPCError } from "@trpc/server";
import { adminProtectedProcedure, createTRPCRouter } from "../../trpc";

export const adminBankAccountRouter = createTRPCRouter({
  getAll: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.transferBank.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Get transfer banks failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mendapatkan akun bank",
      });
    }
  }),

  getById: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const transferBank = await ctx.db.transferBank.findUnique({
          where: { id: input },
        });
        if (!transferBank) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Akun Bank tidak ditemukan",
          });
        }
        return transferBank;
      } catch (error) {
        console.error("Get transfer bank by ID failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal mendapatkan akun bank berdasarkan ID",
        });
      }
    }),

  update: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(50),
        accountNumber: z.string().min(2).max(50),
        accountHolder: z.string().min(2).max(100),
        status: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, name, accountNumber, accountHolder, status } = input;

        const existingTransferBank = await ctx.db.transferBank.findFirst({
          where: {
            OR: [{ name }, { accountNumber }],
            NOT: { id },
          },
        });

        if (existingTransferBank) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Akun Bank dengan nama atau nomor rekening tersebut sudah ada",
          });
        }

        const transferBank = await ctx.db.transferBank.findUnique({
          where: { id },
        });

        if (!transferBank) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Akun Bank tidak ditemukan",
          });
        }

        return await ctx.db.transferBank.update({
          where: { id },
          data: {
            name,
            accountNumber,
            accountHolder,
            status: status ?? transferBank.status,
          },
        });
      } catch (error) {
        console.error("Update transfer bank failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal memperbarui akun bank",
        });
      }
    }),

  create: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        accountNumber: z.string().min(2).max(50),
        accountHolder: z.string().min(2).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, accountNumber, accountHolder } = input;

        const existingTransferBank = await ctx.db.transferBank.findFirst({
          where: {
            OR: [{ name }, { accountNumber }],
          },
        });

        if (existingTransferBank) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Akun Bank dengan nama atau nomor rekening tersebut sudah ada",
          });
        }

        return await ctx.db.transferBank.create({
          data: {
            name,
            accountNumber,
            accountHolder,
          },
        });
      } catch (error) {
        console.error("Create transfer bank failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Gagal membuat transfer bank",
        });
      }
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const transferBank = await ctx.db.transferBank.findUnique({
          where: { id: input },
        });

        if (!transferBank) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transfer Bank tidak ditemukan",
          });
        }

        // Optional: Cek apakah transfer bank ini masih digunakan di penjualan
        const linkedSales = await ctx.db.sales.findFirst({
          where: { transferBankId: input },
          select: { id: true },
        });
        if (linkedSales) {
          await ctx.db.transferBank.update({
            where: { id: input },
            data: { status: false },
          });

          return {
            success: true,
            message:
              "Akun bank dinonaktifkan karena masih digunakan di penjualan.",
          };
        }

        await ctx.db.transferBank.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        console.error("Delete transfer bank failed:", error);
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
