"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconBell, IconLock, IconUser } from "@tabler/icons-react";

type Props = {
  children: React.ReactNode;
};

const settingMenus = [
  {
    href: "/admin/pengaturan/akun-saya",
    icon: <IconUser className="size-4" />,
    label: "Akun Saya",
  },
  {
    href: "/admin/pengaturan/notifikasi",
    icon: <IconBell className="size-4" />,
    label: "Notifikasi",
  },
  {
    href: "/admin/pengaturan/kata-sandi",
    icon: <IconLock className="size-4" />,
    label: "Kata Sandi",
  },
];

const SettingLayout = ({ children }: Props) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="bg-background w-full lg:w-64">
        <nav className="p-4 pt-0 lg:p-6">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:space-y-2">
            {settingMenus.map(({ href, icon, label }) => (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "hover:bg-muted hover:text-primary text-muted-foreground flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors md:justify-start",
                    isActive(href) && "bg-muted text-foreground font-semibold",
                  )}
                  prefetch
                >
                  {icon}
                  <span className="inline">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
};
export default SettingLayout;
