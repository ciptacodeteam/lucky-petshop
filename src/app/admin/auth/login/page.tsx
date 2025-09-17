import AdminLoginForm from "@/components/forms/auth/AdminLoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminLoginPage = () => {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Admin Login</CardTitle>
        <CardDescription>
          Silakan masuk untuk mengelola aplikasi
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AdminLoginForm />
      </CardContent>
    </Card>
  );
};
export default AdminLoginPage;
