import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eliteinfluencer.in"),
  title: {
    default: "Elite Influencer | Brand Campaigns & Paid Collaborations for Creators",
    template: "%s | Elite Influencer",
  },
  description: "India's creator ecosystem for paid brand campaigns, professional portfolios, and social media growth. Find brand deals, build your media kit, and scale your personal brand.",
  openGraph: {
    siteName: "Elite Influencer",
    type: "website",
  },
};

// Organization + WebSite entities — how Google and AI search engines
// understand who Elite Influencer is and what the site offers.
const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Elite Influencer",
    url: "https://eliteinfluencer.in",
    logo: "https://eliteinfluencer.in/logo-full.png",
    email: "eliteinfluencer.in@gmail.com",
    description:
      "Elite Influencer connects content creators with paid brand campaigns and gives them professional tools — portfolio builder, rate calculator, and AI pitch generator — to grow on social media.",
    sameAs: ["https://www.instagram.com/eliteinfluencer.in/"],
    areaServed: "IN",
    knowsAbout: [
      "brand campaigns",
      "paid campaigns",
      "influencer marketing",
      "social media growth",
      "creator economy",
      "brand collaborations",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Elite Influencer",
    url: "https://eliteinfluencer.in",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
