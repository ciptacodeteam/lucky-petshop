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
import { MultiSelect } from "@/components/ui/multi-select";
import { z } from "@/lib/zod";
import { apiClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
  slug: z.string().optional(),
  subCategories: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AddCategoryForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      subCategories: [] as string[],
    },
  });

  const { data: subCategories } = apiClient.admin.subCategory.getAll.useQuery();

  const { mutate, isPending } = apiClient.admin.category.create.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan");
    },
    onError: (err) => {
      toast.error(err.message || "Terjadi kesalahan");
      console.error("create category error: ", err);
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = async (data: FormSchema) => {
    console.log("submit data: ", data);
    mutate({
      name: data.name,
      slug: data.slug,
      subCategories: data.subCategories,
    });
  };

  const watchName = form.watch("name");
  const updateSlug = _.debounce((name) => {
    const slug = slugify(name as string, { lower: true, strict: true });
    form.setValue("slug", slug || "");
  }, 500);

  useEffect(() => {
    // Only update the global state if both fields are filled out
    if (watchName) {
      updateSlug(watchName);
    } else {
      form.setValue("slug", "");
    }
  }, [watchName]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama kategori" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan slug kategori" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategories"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sub Kategori</FormLabel>
                <MultiSelect
                  options={
                    subCategories?.map((sub) => ({
                      label: sub.name,
                      value: sub.id,
                    })) || []
                  }
                  value={field.value}
                  onValueChange={field.onChange}
                  searchable={true}
                  hideSelectAll={false}
                  placeholder="Pilih sub kategori"
                  animationConfig={{
                    badgeAnimation: "bounce",
                    popoverAnimation: "slide",
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <footer className="mt-6 flex justify-end">
          <DialogClose asChild>
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
export default AddCategoryForm;
