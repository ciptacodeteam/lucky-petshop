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
import { useRef } from "react";
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

const AddBankAccountForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      accountHolder: "",
    },
  });

  const utils = apiClient.useUtils();
  const closeRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending } = apiClient.admin.bankAccount.create.useMutation({
    onSuccess: () => {
      utils.admin.bankAccount.getAll.refetch();
      toast.success("Akun Bank berhasil ditambahkan");
      closeRef.current?.click();
    },
    onError: (err) => {
      toast.error(err.message || "Terjadi kesalahan");
      console.error("create bank account error: ", err);
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = async (data: FormSchema) => {
    console.log("submit data: ", data);
    mutate({
      name: data.name,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
    });
  };

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
                  <Input placeholder="Masukkan nama bank" {...field} />
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
              onClick={() => form.reset()}
            >
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" loading={isPending}>
            Simpan
          </Button>
        </footer>
      </form>
    </Form>
  );
};
export default AddBankAccountForm;
