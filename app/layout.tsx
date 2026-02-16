import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sweet N Sugary | Jamnagar's Premium Home Bakery",
  description: "Custom Cakes & Desserts in Jamnagar 🍰 Made with Love & Finest Ingredients.",
  openGraph: {
    title: "Sweet N Sugary | Jamnagar's Premium Home Bakery",
    description: "Order custom 3D cakes, brownies, and treats online. Jamnagar's favorite home bakery.",
    url: 'https://sweetnsugary.in',
    siteName: 'Sweet N Sugary',
    images: [
      {
        url: '/images/gallery_1.jpg', // Using one of the existing gallery images
        width: 800,
        height: 600,
        alt: 'Sweet N Sugary Cake',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lato.variable} font-sans antialiased text-warm-cocoa bg-cream-puff`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
