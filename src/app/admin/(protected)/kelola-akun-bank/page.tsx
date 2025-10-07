import Section from "@/components/sections/Section";
import BankAccountTable from "@/components/tables/tables/BankAccountTable";
import { api, HydrateClient } from "@/trpc/server";

const ManageBankAccountPage = async () => {
  void api.admin.bankAccount.getAll.prefetch();

  return (
    <HydrateClient>
      <main>
        <Section
          title="Kelola Akun Bank"
          description="Halaman untuk mengelola akun bank seperti menambah, mengedit, dan menghapus akun bank."
        >
          <BankAccountTable />
        </Section>
      </main>
    </HydrateClient>
  );
};
export default ManageBankAccountPage;
