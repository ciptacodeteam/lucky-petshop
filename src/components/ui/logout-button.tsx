"use client";

import { apiClient } from "@/trpc/react";
import { Button } from "./button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const { mutate, isPending } = apiClient.admin.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Berhasil keluar");
      router.push("/admin/auth/login");
    },
    onError: (err) => {
      console.error("Logout failed:", err);
      toast.error(err?.message || "Gagal keluar");
    },
  });

  const onLogout = () => {
    mutate();
  };

  return (
    <Button variant="destructive" onClick={onLogout} loading={isPending}>
      Keluar
    </Button>
  );
};
export default LogoutButton;
