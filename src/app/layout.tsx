import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WindowScaler } from "@/components/WindowScaler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PESCA Simulator",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <WindowScaler>{children}</WindowScaler>
      </body>
    </html>
  );
}
