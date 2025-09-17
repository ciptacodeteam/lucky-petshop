import AdminForgetPasswordForm from "@/components/forms/auth/AdminForgetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const AdminForgetPasswordPage = () => {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Lupa Password</CardTitle>
        <CardDescription>
          Silakan masukkan email Anda untuk mereset password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AdminForgetPasswordForm />
      </CardContent>

      <CardFooter className="flex justify-center">
        <Link
          href="/admin/auth/login"
          prefetch
          className="hover:text-primary text-muted-foreground text-sm"
        >
          Kembali ke halaman login
        </Link>
      </CardFooter>
    </Card>
  );
};
export default AdminForgetPasswordPage;
