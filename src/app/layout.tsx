import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WindowScaler } from "@/components/WindowScaler";
import { GlobalVariablesContextProvider } from "@/context/GlobalVariables";
import { BaitsProvider } from "@/context/Baits";

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
        <GlobalVariablesContextProvider>
          <BaitsProvider>
            <WindowScaler>{children}</WindowScaler>
          </BaitsProvider>
        </GlobalVariablesContextProvider>
      </body>
    </html>
  );
}
