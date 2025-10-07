"use client";

import { apiClient } from "@/trpc/react";
import { categoryColumn } from "../columns/category-columns";
import AddCategoryForm from "../forms/categories/AddCategoryForm";
import Modal from "../modals/Modal";
import { DataTable } from "../ui/data-table";

const CategoryTable = () => {
  const [data] = apiClient.admin.category.getAll.useSuspenseQuery();
  return (
    <DataTable
      data={data || []}
      columns={categoryColumn}
      addButton={
        <Modal
          title="Tambah Kategori"
          description="Form untuk menambah kategori baru"
        >
          <AddCategoryForm />
        </Modal>
      }
    />
  );
};
export default CategoryTable;
