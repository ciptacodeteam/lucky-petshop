"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/trpc/react";
import { useConfirmMutation } from "@/hooks/useConfirmMutation";

export function DeleteBankAccountButton({ id }: { id: string }) {
  const { confirmAndMutate } = useConfirmMutation(
    () => apiClient.admin.bankAccount.delete.useMutation(),
    {
      title: "Hapus Akun Bank",
      description: "Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Hapus",
      destructive: true,
      toastMessages: {
        loading: "Menghapus akun bank…",
        success: "Akun bank berhasil dihapus",
        error: (e) => (e as Error)?.message ?? "Gagal menghapus",
      },
      // pilih salah satu:
      invalidate: (utils) => {
        utils.admin.bankAccount.getAll.refetch();
      },
      // atau refetch:
      // refetch:  (utils) => {
      //   utils.admin.bankAccount.getAll.refetch();
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
