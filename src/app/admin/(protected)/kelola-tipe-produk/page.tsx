import AppSectionHeader from "@/components/ui/app-section-header";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/server";
import { columns } from "./columns";

const ManageProductTypePage = async () => {
  const data = await api.admin.productType.getAll();

  return (
    <main>
      <AppSectionHeader
        title="Kelola Tipe Produk"
        description="Tambahkan, edit, atau hapus tipe produk untuk mengatur katalog produk Anda."
      />

      <Card className="pt-2">
        <CardContent>
          <DataTable data={data || []} columns={columns} withAddButton />
        </CardContent>
      </Card>
    </main>
  );
};
export default ManageProductTypePage;
