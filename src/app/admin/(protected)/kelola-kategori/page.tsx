import Section from "@/components/sections/Section";
import CategoryTable from "@/components/tables/CategoryTable";
import { api, HydrateClient } from "@/trpc/server";

const ManageCategoryPage = async () => {
  void api.admin.category.getAll.prefetch();

  return (
    <HydrateClient>
      <main>
        <Section
          title="Kelola Kategori"
          description="Halaman untuk mengelola kategori seperti menambah, mengedit, dan menghapus kategori."
        >
          <CategoryTable />
        </Section>
      </main>
    </HydrateClient>
  );
};
export default ManageCategoryPage;
