"use client";

import { Bell, ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "./skeleton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppUserProfile from "./app-user-profile";
import { getNameInitial, getTwoWordName } from "@/lib/utils";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { data, isPending } = authClient.useSession();
  const user = data?.user;

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

  if (isPending || !user) {
    return <Skeleton className="h-10 w-full rounded-lg" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="rounded-lg">
                  {getNameInitial(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {getTwoWordName(user.name)}
                </span>
                <span className="line-clamp-1 truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <AppUserProfile />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/admin/pengaturan/akun-saya")}
              >
                <User />
                Akun Saya
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/pengaturan/notifikasi")}
              >
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
