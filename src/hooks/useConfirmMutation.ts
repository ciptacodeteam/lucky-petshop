"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { apiClient } from "@/trpc/react"; // sesuaikan path-mu

type ToastMsg<T> = string | ((data: T) => string);
type ConfirmMutationOptions<TVars, TResult> = {
  // confirm dialog
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;

  // toast
  toastMessages?: {
    loading?: string;
    success?: ToastMsg<TResult>;
    error?: ToastMsg<unknown>;
  };

  // post mutate behaviors
  invalidate?: (
    utils: ReturnType<typeof apiClient.useUtils>,
  ) => Promise<void> | void;
  refetch?: (
    utils: ReturnType<typeof apiClient.useUtils>,
  ) => Promise<void> | void;
};

export function useConfirmMutation<TVars, TResult>(
  useTrpcMutation: () => { mutateAsync: (vars: TVars) => Promise<TResult> },
  opts?: ConfirmMutationOptions<TVars, TResult>,
) {
  const confirm = useConfirm();
  const mutation = useTrpcMutation();
  const utils = apiClient.useUtils();

  const confirmAndMutate = useCallback(
    async (vars: TVars) => {
      const ok = await confirm({
        title: opts?.title ?? "Apakah Anda yakin?",
        description: opts?.description ?? "Aksi ini tidak dapat dibatalkan.",
        confirmText: opts?.confirmText ?? "Lanjutkan",
        cancelText: opts?.cancelText ?? "Batal",
        destructive: opts?.destructive ?? true,
      });
      if (!ok) return;

      const loading = opts?.toastMessages?.loading ?? "Memproses…";
      const success = opts?.toastMessages?.success ?? "Berhasil";
      const error = opts?.toastMessages?.error ?? "Terjadi kesalahan";

      try {
        const result = toast.promise(mutation.mutateAsync(vars), {
          loading,
          success: (r) =>
            typeof success === "function" ? success(r) : success,
          error: (e) => (typeof error === "function" ? error(e) : error),
        });

        if (opts?.invalidate) await opts.invalidate(utils);
        if (opts?.refetch) await opts.refetch(utils);

        return result;
      } catch (e) {
        // toast.promise sudah menampilkan error
        throw e;
      }
    },
    [confirm, mutation, utils, opts],
  );

  return { confirmAndMutate };
}
