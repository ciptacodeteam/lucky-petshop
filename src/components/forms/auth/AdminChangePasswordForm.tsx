"use client";

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
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z
  .object({
    oldPassword: z.string().min(6).max(32, "Password maksimal 32 karakter"),
    password: z.string().min(6).max(32, "Password maksimal 32 karakter"),
    confirmPassword: z.string().min(6).max(32, "Password maksimal 32 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });
type FormSchema = z.infer<typeof formSchema>;

const AdminChangePasswordForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = apiClient.admin.auth.changePassword.useMutation(
    {
      onSuccess: () => {
        form.reset();
        toast.success("Password berhasil diubah");
      },
      onError: (error) => {
        console.error("change password error", error);
        toast.error(error.message || "Gagal mengubah password");
      },
    },
  );

  const onSubmit = (data: FormSchema) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Lama</FormLabel>
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

        <Button type="submit" className="mt-6" loading={isPending}>
          Ganti Password
        </Button>
      </form>
    </Form>
  );
};
export default AdminChangePasswordForm;
