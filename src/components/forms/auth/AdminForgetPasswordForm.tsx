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
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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

  const router = useRouter();

  const onSubmit = (values: FormSchema) => {
    console.log("login payload: ", values);
    router.push("/admin/auth/reset-password");
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

        <Button type="submit" className="mt-5 w-full" size={"lg"}>
          Kirim link reset password
        </Button>
      </form>
    </Form>
  );
};
export default AdminForgetPasswordForm;
