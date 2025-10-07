"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/trpc/react";
import { useConfirmMutation } from "@/hooks/useConfirmMutation";

export function DeleteSubCategoryButton({ id }: { id: string }) {
  const { confirmAndMutate } = useConfirmMutation(
    () => apiClient.admin.subCategory.delete.useMutation(),
    {
      title: "Hapus Sub Kategori",
      description: "Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Hapus",
      destructive: true,
      toastMessages: {
        loading: "Menghapus sub kategori…",
        success: "Sub kategori berhasil dihapus",
        error: (e) => (e as Error)?.message ?? "Gagal menghapus",
      },
      // pilih salah satu:
      invalidate: (utils) => {
        utils.admin.subCategory.getAll.refetch();
        utils.admin.category.getAll.refetch();
      },
      // atau refetch:
      // refetch:  (utils) => {
      //   utils.admin.subCategory.getAll.refetch();
      // },
    },
  );

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => confirmAndMutate(id)}
      aria-label="Hapus Sub Kategori"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
