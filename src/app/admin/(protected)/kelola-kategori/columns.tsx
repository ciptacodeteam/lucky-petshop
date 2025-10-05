"use client";
import { Button } from "@/components/ui/button";
import type { Category } from "@prisma/client";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const colHelper = createColumnHelper<Category>();
export const columns = [
  colHelper.accessor("name", {
    header: "Nama Kategori",
    cell: (info) => info.getValue(),
  }),
  colHelper.accessor("createdAt", {
    header: "Dibuat Pada",
    cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY"),
  }),
  colHelper.display({
    id: "actions",
    header: "Aksi",
    cell: () => (
      <div className="flex items-center gap-2">
        <Button variant={"secondary"} size={"icon"}>
          <IconPencil className="!size-4" />
        </Button>
        <Button variant={"destructive"} size={"icon"}>
          <IconTrash className="!size-4" />
        </Button>
      </div>
    ),
  }),
];
