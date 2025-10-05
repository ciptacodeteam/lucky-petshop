import AddCategoryForm from "@/components/forms/categories/AddCategoryForm";
import Modal from "@/components/modals/Modal";
import Section from "@/components/sections/Section";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/server";
import { columns } from "./columns";

const ManageCategoryPage = async () => {
  const data = await api.admin.category.getAll();

  return (
    <main>
      <Section
        title="Kelola Kategori"
        description="Halaman untuk mengelola kategori seperti menambah, mengedit, dan menghapus kategori."
      >
        <DataTable
          data={data || []}
          columns={columns}
          addButton={
            <Modal
              title="Tambah Kategori"
              description="Form untuk menambah kategori baru"
            >
              <AddCategoryForm />
            </Modal>
          }
        />
      </Section>
    </main>
  );
};
export default ManageCategoryPage;
