"use client";
import { DeleteSubCategoryButton } from "@/components/forms/subCategories/DeleteSubCategoryButton";
import EditSubCategoryForm from "@/components/forms/subCategories/EditSubCategoryForm";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import type { SubCategory } from "@prisma/client";
import { IconPencil } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const colHelper = createColumnHelper<SubCategory>();
export const subCategoryColumn = [
  colHelper.accessor("id", {
    header: "No",
    meta: {
      width: 80,
    },
    cell: (info) => info.row.index + 1,
  }),
  colHelper.accessor("name", {
    header: "Nama Sub Kategori",
    cell: (info) => info.getValue(),
  }),
  colHelper.accessor("createdAt", {
    header: "Dibuat Pada",
    cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY"),
  }),
  colHelper.display({
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
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
          <EditSubCategoryForm id={row.original.id} />
        </Modal>
        <DeleteSubCategoryButton id={row.original.id} />
      </div>
    ),
  }),
];
