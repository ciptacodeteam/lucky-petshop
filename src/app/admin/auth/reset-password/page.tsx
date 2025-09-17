import AdminResetPasswordForm from "@/components/forms/auth/AdminResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const AdminResetPasswordPage = () => {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>Silahkan masukkan password baru Anda</CardDescription>
      </CardHeader>

      <CardContent>
        <AdminResetPasswordForm />
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

export default AdminResetPasswordPage;
