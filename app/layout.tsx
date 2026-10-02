import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Loader from "./components/Loader";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import FloatingCart from "./components/FloatingCart";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sridhakshinacrackers.in'),
  title: "Sri Dhakshina Crackers | Premium Sivakasi Fireworks Online",
  description: "Buy premium quality Sivakasi crackers online at wholesale prices. Safe, reliable, and authentic fireworks delivered across India from Sri Dhakshina Crackers.",
  keywords: "Sivakasi crackers, buy fireworks online, wholesale crackers, Diwali fireworks, Sri Dhakshina Crackers, safe firecrackers online, Sivakasi fireworks delivery, online crackers shopping",
  authors: [{ name: "Sri Dhakshina Crackers", url: "https://sridhakshinacrackers.in" }],
  creator: "Sri Dhakshina Crackers",
  publisher: "Sri Dhakshina Crackers",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sridhakshinacrackers.in",
    title: "Sri Dhakshina Crackers | Premium Sivakasi Fireworks Online",
    description: "Buy premium quality Sivakasi crackers online at wholesale prices. Safe, reliable, and authentic fireworks delivered across India.",
    siteName: "Sri Dhakshina Crackers",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sri Dhakshina Crackers - Premium Sivakasi Fireworks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Dhakshina Crackers | Premium Sivakasi Fireworks",
    description: "Buy premium quality Sivakasi crackers online at wholesale prices. Authentic fireworks delivered across India.",
    images: ["/assets/images/logo.png"],
  },
  icons: {
    icon: "/assets/images/logo.png", // favicon
    apple: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-black`}
      >
        {/* Loading animation */}
        <Loader />

        {/* Main Application */}
        <CartProvider>
          <CartDrawer />
          <FloatingCart />
          {children}
        </CartProvider>
        
        {/* Local Business Schema for Google SEO & Google Business Profile */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Sri Dhakshina Crackers",
              "image": "https://sridhakshinacrackers.in/assets/images/logo.png",
              "@id": "https://sridhakshinacrackers.in",
              "url": "https://sridhakshinacrackers.in",
              "telephone": "+919894116131",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "D.NO. 177/5/18, Pernaickenpatti, Sithurajapuram",
                "addressLocality": "Virudhunagar",
                "addressRegion": "TN",
                "postalCode": "626189",
                "addressCountry": "IN"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "22:00"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
