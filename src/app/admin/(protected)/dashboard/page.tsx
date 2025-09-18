import LogoutButton from "@/components/ui/logout-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
      <LogoutButton />

      <pre className="mt-4">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};
export default DashboardPage;
