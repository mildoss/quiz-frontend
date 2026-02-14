import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import StoreProvider from "@/providers/StoreProvider";
import {Inter} from "next/font/google"
import {Menu} from "@/components/Menu";
import {AuthProvider} from "@/providers/AuthProvider";
import {SocketProvider} from "@/providers/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Quiz App - play together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className="min-h-screen flex flex-col"
        suppressHydrationWarning
      >
      <StoreProvider>
        <AuthProvider>
          <SocketProvider>
        <header className="sticky top-0 left-0 w-full z-10 p-2 bg-gray-800">
          <Menu/>
        </header>
        <main className="flex-1 container mx-auto">
          {children}
        </main>
          </SocketProvider>
        </AuthProvider>
      </StoreProvider>
      </body>
    </html>
  );
}
