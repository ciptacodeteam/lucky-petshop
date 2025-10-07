"use client";

import { apiClient } from "@/trpc/react";
import { subCategoryColumn } from "../columns/sub-category-columns";
import AddSubCategoryForm from "../forms/subCategories/AddSubCategoryForm";
import Modal from "../modals/Modal";
import { DataTable } from "../ui/data-table";

const SubCategoryTable = () => {
  const [data] = apiClient.admin.subCategory.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={data || []}
      columns={subCategoryColumn}
      addButton={
        <Modal
          title="Tambah Sub Kategori"
          description="Form untuk menambah sub kategori baru"
        >
          <AddSubCategoryForm />
        </Modal>
      }
    />
  );
};
export default SubCategoryTable;
