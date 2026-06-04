import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SiteDataProvider } from "@/lib/admin/data-context";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AccTax Solutions — GST Filing & Taxation Services in India",
  description: "Professional GST filing, income tax return, TDS, and business compliance services in India. Trusted by 5000+ businesses. File your taxes with ease.",
  keywords: "GST filing, income tax, TDS, tax consultancy, business registration, India tax services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <SiteDataProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SiteDataProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
