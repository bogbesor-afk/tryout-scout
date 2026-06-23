import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import HamburgerMenu from "@/components/HamburgerMenu";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tryout Scout",
  description: "Soccer tryout evaluation app for coaches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-50 text-gray-900`}>
        <HamburgerMenu />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
