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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { z } from "@/lib/zod";
import { apiClient } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { CopyIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
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

  const { data: subCategories, isPending: isSubCategoryPending } =
    apiClient.admin.subCategory.getAll.useQuery();

  const utils = apiClient.useUtils();

  const { mutate, isPending } = apiClient.admin.category.create.useMutation({
    onSuccess: () => {
      utils.admin.category.getAll.refetch();
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
  const slugDirtyRef = useRef(false); // menandai user pernah edit slug

  useEffect(() => {
    const sub = form.watch((_all, { name, type }) => {
      if (name === "slug" && type === "change") {
        slugDirtyRef.current = true;
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const updateSlug = useMemo(
    () =>
      _.debounce((name: string) => {
        // hanya auto-generate bila slug belum pernah disentuh user
        if (slugDirtyRef.current) return;
        const next = slugify(name ?? "", { lower: true, strict: true });
        form.setValue("slug", next || "", {
          shouldDirty: true,
          shouldValidate: true,
        });
      }, 400),
    [form],
  );

  useEffect(() => {
    if (typeof watchName === "string") {
      if (watchName.trim().length) {
        updateSlug(watchName);
      } else if (!slugDirtyRef.current) {
        form.setValue("slug", "", { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [watchName, form, updateSlug]);

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
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Masukkan slug sub Kategori"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        slugDirtyRef.current = true; // tandai manual edit
                        field.onChange(e);
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InputGroupButton
                            variant="ghost"
                            aria-label="Info"
                            size="icon-xs"
                            onClick={() => {
                              if (field.value) {
                                navigator.clipboard.writeText(field.value);
                                toast.success("Slug disalin ke clipboard");
                              }
                            }}
                          >
                            <CopyIcon className="size-4" />
                          </InputGroupButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Salin</span>
                        </TooltipContent>
                      </Tooltip>
                    </InputGroupAddon>
                  </InputGroup>
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
                  loading={isSubCategoryPending}
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
              onClick={() => {
                form.reset();
                slugDirtyRef.current = false;
              }}
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
