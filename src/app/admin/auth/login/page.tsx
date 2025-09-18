import AdminLoginForm from "@/components/forms/auth/AdminLoginForm";
import AdminRegisterForm from "@/components/forms/auth/AdminRegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

const AdminLoginPage = async () => {
  const isAdminExists = await api.admin.auth.checkAccountExist();

  return (
    <>
      {!isAdminExists?.exists ? (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>Admin Login - Buat Akun Admin</CardTitle>
            <CardDescription>
              Silakan buat akun admin untuk mengelola aplikasi
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AdminRegisterForm />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Silakan masuk untuk mengelola aplikasi
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
      )}
    </>
  );
};
export default AdminLoginPage;
