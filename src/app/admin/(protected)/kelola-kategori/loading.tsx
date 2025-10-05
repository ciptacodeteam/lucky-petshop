import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main>
      <header className="mb-8">
        <Skeleton className="mb-2 h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </header>
      <Card className="pt-2">
        <CardContent>
          <DataTable data={[]} columns={[]} loading withAddButton />
        </CardContent>
      </Card>
    </main>
  );
};
export default Loading;
