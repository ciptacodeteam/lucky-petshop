"use client";
import { DeleteCategoryButton } from "@/components/forms/categories/DeleteCategoryButton";
import EditCategoryForm from "@/components/forms/categories/EditCategoryForm";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import type { Category } from "@prisma/client";
import { IconPencil } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const colHelper = createColumnHelper<Category>();
export const categoryColumn = [
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
    cell: (info) => (
      <div className="flex items-center gap-2">
        <Modal
          triggerChildren={
            <Button variant={"secondary"} size={"icon"}>
              <IconPencil className="!size-4" />
            </Button>
          }
          title="Edit Sub Kategori"
          description="Form untuk mengedit sub kategori"
        >
          <EditCategoryForm id={info.row.original.id} />
        </Modal>
        <DeleteCategoryButton id={info.row.original.id} />
      </div>
    ),
  }),
];
