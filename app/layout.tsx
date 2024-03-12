import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider  from '../components/SessionProvider'
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <SessionProvider>
            <main>
              {children}
              <Toaster />
            </main>
          </SessionProvider>
        </body>
    </html>
  );
}
