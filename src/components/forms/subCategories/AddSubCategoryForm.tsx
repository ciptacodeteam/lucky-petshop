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
    .min(2, "Nama sub Kategori minimal 2 karakter")
    .max(50, "Nama sub Kategori maksimal 50 karakter"),
  slug: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AddSubCategoryForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const utils = apiClient.useUtils();
  const closeRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending } = apiClient.admin.subCategory.create.useMutation({
    onSuccess: () => {
      utils.admin.subCategory.getAll.refetch();
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
        </div>

        <footer className="mt-6 flex justify-end">
          <DialogClose asChild ref={closeRef}>
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
export default AddSubCategoryForm;
