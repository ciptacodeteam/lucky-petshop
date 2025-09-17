import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardPage = async () => {
  const session = auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

      <pre className="mt-4">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};
export default DashboardPage;
