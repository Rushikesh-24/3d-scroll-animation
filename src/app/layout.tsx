import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Database Management and Query Processing Project",
  description:
    "A project on Database Management and Query Processing developed by our group: Rushikesh, Shrutvika, and Shikhaa.",
  keywords: [
    "Database Management",
    "Query Processing",
    "DBMS",
    "SQL",
    "Database Project",
    "Data Modeling",
    "Database Systems",
    "Rushikesh",
    "Shrutvika",
    "Shikhaa"
  ],
  authors: [
    { name: "Rushikesh" },
    { name: "Shrutvika" },
    { name: "Shikhaa" }
  ],
  creator: "Rushikesh, Shrutvika, Shikhaa",
  openGraph: {
    title: "Database Management and Query Processing Project",
    description:
      "A project on Database Management and Query Processing developed by our group: Rushikesh, Shrutvika, and Shikhaa.",
    url: "https://dbmqp.vercel.app/",
    siteName: "DBMQP Project",
    images: [
      {
        url: "https://dbmqp.vercel.app/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Database Management and Query Processing Project",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Database Management and Query Processing Project",
    description:
      "A project on Database Management and Query Processing developed by our group: Rushikesh, Shrutvika, and Shikhaa.",
    images: ["https://dbmqp.vercel.app/vercel.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
