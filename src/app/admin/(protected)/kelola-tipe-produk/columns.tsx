"use client";
import type { ProductType } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const colHelper = createColumnHelper<ProductType>();
export const columns = [
  colHelper.accessor("name", {
    header: "Nama Tipe Produk",
    cell: (info) => info.getValue(),
  }),
  colHelper.accessor("createdAt", {
    header: "Dibuat Pada",
    cell: (info) => dayjs(info.getValue() as Date).format("DD MMM YYYY"),
  }),
];
