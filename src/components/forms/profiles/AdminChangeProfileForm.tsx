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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { z } from "@/lib/zod";
import { apiClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  email: z.email("Email tidak valid").max(100, "Email maksimal 100 karakter"),
  image: z.file().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AdminChangeProfileForm = () => {
  const {
    data: session,
    isPending: isSessionPending,
    refetch,
  } = authClient.useSession();
  const user = session?.user || null;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    disabled: isSessionPending,
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const { mutate, isPending } = apiClient.admin.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profil berhasil diubah");
      refetch();
    },
    onError: (error) => {
      console.error("change profile error", error);
      toast.error(error.message || "Gagal mengubah profil");
    },
  });

  const onSubmit = (data: FormSchema) => {
    mutate(data);
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
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={"Masukkan alamat email"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Role</FormLabel>
            <Input
              value={user?.role || "N/A"}
              disabled
              readOnly
              className="capitalize"
            />
          </FormItem>
        </div>

        <Button type="submit" className="mt-6" loading={isPending}>
          Simpan
        </Button>
      </form>
    </Form>
  );
};
export default AdminChangeProfileForm;
