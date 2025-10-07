"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "@/lib/zod";
import { apiClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nama bank minimal 2 karakter")
    .max(50, "Nama bank maksimal 50 karakter"),
  accountNumber: z
    .string()
    .min(2, "Nomor rekening minimal 2 karakter")
    .max(50, "Nomor rekening maksimal 50 karakter"),
  accountHolder: z
    .string()
    .min(2, "Nama pemilik rekening minimal 2 karakter")
    .max(100, "Nama pemilik rekening maksimal 100 karakter"),
});

type FormSchema = z.infer<typeof formSchema>;

type EditBankAccountFormProps = {
  id: string; // sesuaikan: uuid/cuid/cuid2 sesuai backend-mu
  onDone?: () => void; // dipanggil saat sukses (opsional)
};

const EditBankAccountForm = ({ id, onDone }: EditBankAccountFormProps) => {
  /**
   * 1) Fetch detail & categories
   */
  const {
    data: detail,
    isPending: isLoadingDetail,
    isError: isDetailError,
    error: detailError,
  } = apiClient.admin.bankAccount.getById.useQuery(id, {
    // optional: staleTime: 30_000,
  });

  /**
   * 2) RHF setup
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      accountHolder: "",
    },
  });

  // inject default values setelah detail masuk
  useEffect(() => {
    if (!detail) return;
    form.reset({
      name: detail.name ?? "",
      accountNumber: detail.accountNumber ?? "",
      accountHolder: detail.accountHolder ?? "",
    });
  }, [detail, form]);

  const utils = apiClient.useUtils();
  const closeRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: updateMutate, isPending: isUpdating } =
    apiClient.admin.bankAccount.update.useMutation({
      onSuccess: () => {
        // invalidate/refetch list & detail
        utils.admin.bankAccount.getAll.refetch();
        utils.admin.bankAccount.getById.refetch(id);
        toast.success("Akun Bank berhasil diperbarui");
        closeRef.current?.click();
        onDone?.();
      },
      onError: (err) => {
        toast.error(err?.message || "Terjadi kesalahan");
        console.error("update bank account error: ", err);
      },
    });

  const onSubmit = (data: FormSchema) => {
    if (!detail) return;

    // Hindari kirim field unchanged bila backend ketat; tapi aman kirim semua:
    updateMutate({
      id,
      name: data.name.trim(),
      accountHolder: data.accountHolder.trim(),
      accountNumber: data.accountNumber.trim(),
    });
  };

  if (isDetailError) {
    return (
      <div className="text-destructive text-sm">
        Gagal memuat data: {detailError?.message ?? "Unknown error"}
      </div>
    );
  }

  const disableSubmit =
    isLoadingDetail ||
    isUpdating ||
    !form.formState.isDirty ||
    !form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Bank</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan nama bank"
                    {...field}
                    disabled={isLoadingDetail || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pemilik Rekening</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan nama pemilik rekening"
                    {...field}
                    disabled={isLoadingDetail || isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Rekening</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan nomor rekening"
                    {...field}
                    inputMode="numeric"
                    disabled={isLoadingDetail || isUpdating}
                    onBeforeInput={(e) => {
                      const char = e.data;
                      if (char && !/[\d\s]/.test(char)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <footer className="mt-6 flex justify-end">
          <DialogClose asChild ref={closeRef}>
            <Button
              type="button"
              variant="ghost"
              className="mr-3"
              onClick={() => {
                // reset ke data server terakhir
                if (detail) {
                  form.reset({
                    name: detail.name ?? "",
                    accountNumber: detail.accountNumber ?? "",
                    accountHolder: detail.accountHolder ?? "",
                  });
                } else {
                  form.reset();
                }
              }}
              disabled={isUpdating}
            >
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" loading={isUpdating} disabled={disableSubmit}>
            Simpan
          </Button>
        </footer>
      </form>
    </Form>
  );
};

export default EditBankAccountForm;
