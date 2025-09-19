"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Bell, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppUserProfile from "./app-user-profile";

const AppProfileMenu = () => {
  const router = useRouter();

  const [isPendingLogout, setIsPendingLogout] = useState(false);

  const onLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => setIsPendingLogout(true),
        onSuccess: () => {
          router.push("/admin/auth/login");
          toast.success("Berhasil keluar");
        },
        onError: (error) => {
          console.error("Error during sign out:", error);
          toast.error(error.error.message || "Gagal keluar");
        },
      },
    });

    setIsPendingLogout(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AppUserProfile />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <AppUserProfile />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/admin/profil")}>
            <User />
            Akun Saya
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/admin/notifikasi")}>
            <Bell />
            Notifikasi
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          loading={isPendingLogout}
          variant="destructive"
          onSelect={onLogout}
        >
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AppProfileMenu;
