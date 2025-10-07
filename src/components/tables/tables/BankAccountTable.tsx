"use client";

import { bankAccountColumn } from "@/components/columns/bank-account-columns";
import AddBankAccountForm from "@/components/forms/bankAccounts/AddBankAccountForm";
import Modal from "@/components/modals/Modal";
import { DataTable } from "@/components/ui/data-table";
import { apiClient } from "@/trpc/react";

const BankAccountTable = () => {
  const [data] = apiClient.admin.bankAccount.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={data || []}
      columns={bankAccountColumn}
      addButton={
        <Modal
          title="Tambah Akun Bank"
          description="Form untuk menambah akun bank baru"
        >
          <AddBankAccountForm />
        </Modal>
      }
    />
  );
};
export default BankAccountTable;
