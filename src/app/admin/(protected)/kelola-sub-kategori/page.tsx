import AddSubCategoryForm from "@/components/forms/subCategories/AddSubCategoryForm";
import Modal from "@/components/modals/Modal";
import Section from "@/components/sections/Section";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/server";
import { columns } from "./columns";

const ManageSubCategoryPage = async () => {
  const data = await api.admin.subCategory.getAll();

  return (
    <main>
      <Section
        title="Kelola Sub Kategori"
        description="Halaman untuk mengelola sub kategori seperti menambah, mengedit, dan menghapus sub kategori."
      >
        <DataTable
          data={data || []}
          columns={columns}
          addButton={
            <Modal
              title="Tambah Sub Kategori"
              description="Form untuk menambah sub kategori baru"
            >
              <AddSubCategoryForm />
            </Modal>
          }
        />
      </Section>
    </main>
  );
};
export default ManageSubCategoryPage;
