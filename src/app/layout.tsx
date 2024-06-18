import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";

const cybergeek = localFont({ src: "./K2D-Regular.ttf" });

export const metadata: Metadata = {
  title: "Sign In - CyberGeekClub",
  description: "Website for Administrator CyberGeekClub",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body data-theme="cybergeek-dark" className={cybergeek.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
