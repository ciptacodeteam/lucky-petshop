import "@/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import MainProvider from "@/providers/MainProvider";

export const metadata: Metadata = {
  title: "Lucky Petshop",
  description:
    "E-Commerce terpercaya yang menyediakan berbagai produk berkualitas untuk hewan peliharaan Anda, mulai dari makanan, aksesoris, hingga perlengkapan perawatan. Temukan kebutuhan terbaik untuk anabul kesayangan Anda di Lucky Petshop.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <MainProvider>{children}</MainProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
