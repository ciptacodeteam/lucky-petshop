"use client";

import { z } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";

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
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormSchema) => {
    console.log("reset password payload: ", data);
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
            name="password"
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

        <Button type="submit" className="mt-6 w-full" size={"lg"}>
          Reset Password
        </Button>
      </form>
    </Form>
  );
};
export default AdminResetPasswordForm;
