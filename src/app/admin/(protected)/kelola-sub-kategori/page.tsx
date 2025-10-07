import Section from "@/components/sections/Section";
import SubCategoryTable from "@/components/tables/SubCategoryTable";
import { api, HydrateClient } from "@/trpc/server";

const ManageSubCategoryPage = async () => {
  void api.admin.subCategory.getAll.prefetch();

  return (
    <HydrateClient>
      <main>
        <Section
          title="Kelola Sub Kategori"
          description="Halaman untuk mengelola sub kategori seperti menambah, mengedit, dan menghapus sub kategori."
        >
          <SubCategoryTable />
        </Section>
      </main>
    </HydrateClient>
  );
};
export default ManageSubCategoryPage;
