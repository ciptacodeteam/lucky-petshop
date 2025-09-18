"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { z } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email("Email atau password salah"),
  password: z.string().min(6).max(30, "Password maksimal 30 karakter"),
  rememberMe: z.boolean().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AdminLoginForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: () => {
          toast.success("Berhasil masuk sebagai admin");
          form.reset();
          router.push(from);
        },
        onError: (err) => {
          console.error("login error: ", err);
          toast.error(err.error.message || "Gagal masuk sebagai admin");
        },
      },
    });

    setIsPending(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Masukkan alamat email"
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
                <FormLabel>Password</FormLabel>
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
        <div className="mt-3 grid grid-cols-2 items-center">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0 ml-1">Ingat saya</FormLabel>
              </FormItem>
            )}
          />
          <div className="text-muted-foreground text-right text-sm">
            <Link
              href="/admin/auth/lupa-password"
              className="hover:text-primary"
            >
              Lupa password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          size={"lg"}
          loading={isPending}
        >
          Masuk
        </Button>
      </form>
    </Form>
  );
};
export default AdminLoginForm;
