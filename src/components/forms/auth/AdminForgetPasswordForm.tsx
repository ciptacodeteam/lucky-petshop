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
import { Input } from "@/components/ui/input";
import { z } from "@/lib/zod";
import { apiClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email("Email tidak valid"),
});

type FormSchema = z.infer<typeof formSchema>;

const AdminForgetPasswordForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } =
    apiClient.admin.auth.requestPasswordReset.useMutation({
      onSuccess: () => {
        toast.success("Link reset password telah dikirim ke email Anda");
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Gagal mengirim link reset password");
      },
    });

  const onSubmit = async (data: FormSchema) => {
    console.log("login payload: ", data);
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <Alert variant="info">
            <IconInfoCircle />
            <AlertDescription>
              Link untuk mereset password akan dikirim ke email Anda jika
              terdaftar
            </AlertDescription>
          </Alert>

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
        </div>

        <Button
          type="submit"
          className="mt-5 w-full"
          size={"lg"}
          loading={isPending}
        >
          Kirim link reset password
        </Button>
      </form>
    </Form>
  );
};
export default AdminForgetPasswordForm;
