import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans } from "@/constants/fonts/font";
import { Toaster } from "@/components/ui/toaster";
import { GlobalProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Feedy",
  description: "A platform to get feed of websites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden max-w-screen w-screen  antialiased`}
      >
        <GlobalProvider>
          <Navbar />
          {children}
        </GlobalProvider>
        <Toaster />
      </body>
    </html>
  );
}
