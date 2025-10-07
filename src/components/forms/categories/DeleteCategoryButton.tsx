"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/trpc/react";
import { useConfirmMutation } from "@/hooks/useConfirmMutation";

export function DeleteCategoryButton({ id }: { id: string }) {
  const { confirmAndMutate } = useConfirmMutation(
    () => apiClient.admin.category.delete.useMutation(),
    {
      title: "Hapus Kategori",
      description: "Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Hapus",
      destructive: true,
      toastMessages: {
        loading: "Menghapus kategori…",
        success: "Kategori berhasil dihapus",
        error: (e) => (e as Error)?.message ?? "Gagal menghapus",
      },
      // pilih salah satu:
      invalidate: (utils) => {
        utils.admin.category.getAll.refetch();
        utils.admin.subCategory.getAll.refetch();
      },
      // atau refetch:
      // refetch:  (utils) => {
      //   utils.admin.category.getAll.refetch();
      // },
    },
  );

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => confirmAndMutate(id)}
      aria-label="Hapus Kategori"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
