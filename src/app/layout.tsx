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

const siteUrl = "https://gst-taxation-platform.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AccTax Solutions — Best GST Filing & Income Tax Services in India",
    template: "%s | AccTax Solutions — Tax & GST Experts",
  },
  description: "Professional GST registration, income tax filing, TDS return, and business compliance services in India. 13+ years of expertise. Trusted by 100+ businesses. Call +91 9613461462.",
  keywords: [
    "GST filing", "income tax filing", "tax consultant India", "GST registration",
    "income tax return", "TDS return filing", "business compliance", "tax consultancy",
    "best tax consultant", "tax filing services", "GST return filing", "income tax calculator",
    "tax advisor near me", "GST consultant", "accounting services India", "tax expert",
  ],
  authors: [{ name: "Santosh Sharma", url: siteUrl }],
  creator: "AccTax Solutions",
  publisher: "AccTax Solutions",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "AccTax Solutions",
    title: "AccTax Solutions — GST Filing, Income Tax & Business Compliance Services",
    description: "Professional GST registration, income tax filing, TDS return, and business compliance services in India. 13+ years of expertise.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AccTax Solutions - Tax & GST Services India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AccTax Solutions — GST Filing & Income Tax Services",
    description: "Professional tax and compliance services in India. GST registration, income tax, TDS, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "tax services",
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "AccTax Solutions",
  "alternateName": "AccTax Solutions - Tax & GST Consultancy",
  "description": "Professional GST filing, income tax return, TDS, and business compliance services in India. Founded by Santosh Sharma.",
  "url": siteUrl,
  "telephone": "+91 9613461462",
  "email": "info@acctaxsolutions.in",
  "foundingDate": "2023",
  "founder": {
    "@type": "Person",
    "name": "Santosh Sharma",
    "jobTitle": "Accountant & Tax Consultant",
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Fancy Ali",
    "addressLocality": "Jorhat",
    "addressRegion": "Assam",
    "postalCode": "785001",
    "addressCountry": "IN",
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91 9613461462",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"],
    },
  ],
  "sameAs": [
    `https://wa.me/919613461462`,
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "19:00",
    },
  ],
  "areaServed": "India",
  "priceRange": "₹₹",
  "image": `${siteUrl}/og-image.png`,
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "100",
    "bestRating": "5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
