"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { z } from "@/lib/zod";
import { apiClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z.string().min(6).max(32, "Password maksimal 32 karakter"),
    confirmPassword: z.string().min(6).max(32, "Password maksimal 32 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

const AdminResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = apiClient.admin.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password berhasil diubah, silahkan login");
      router.push("/admin/auth/login");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengubah password");
    },
  });

  const onSubmit = (data: FormSchema) => {
    if (!token) {
      return toast.error("Token tidak ditemukan");
    }

    mutate({ ...data, token: token });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <Alert variant="warning">
            <IconInfoCircle />
            <AlertDescription>
              Abaikan jika tidak merasa melakukan permintaan ini! Anda akan
              diarahkan ke halaman login setelah berhasil mengubah password.
            </AlertDescription>
          </Alert>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Baru</FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
                    placeholder={"•••••••"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
                    placeholder={"•••••••"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          size={"lg"}
          loading={isPending}
        >
          Reset Password
        </Button>
      </form>
    </Form>
  );
};
export default AdminResetPasswordForm;
