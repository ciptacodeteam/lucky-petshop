"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import _ from "lodash";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nama sub Kategori minimal 2 karakter")
    .max(50, "Nama sub Kategori maksimal 50 karakter"),
  slug: z.string().optional(),
  categoryId: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AddSubCategoryForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: undefined,
      slug: "",
    },
  });

  const { data: categories, isPending: isLoadingCategories } =
    apiClient.admin.category.getAll.useQuery();

  const utils = apiClient.useUtils();
  const closeRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending } = apiClient.admin.subCategory.create.useMutation({
    onSuccess: async () => {
      await utils.admin.subCategory.getAll.refetch();
      toast.success("Sub Kategori berhasil ditambahkan");
      closeRef.current?.click();
    },
    onError: (err) => {
      toast.error(err.message || "Terjadi kesalahan");
      console.error("create sub category error: ", err);
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
                <FormLabel>Nama Sub Kategori</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama sub Kategori" {...field} />
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
                  <Input placeholder="Masukkan slug sub Kategori" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Kategori</FormLabel>
                <Combobox
                  loading={isLoadingCategories}
                  options={
                    categories?.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    })) || []
                  }
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Pilih Kategori"
                />
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
export default AddSubCategoryForm;
