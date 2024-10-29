import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ToastProvider from "@/providers/toast-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kerafresh",
  description: "Bringing quality to your doorstep",
  openGraph: {
    title: "Kerafresh",
    description: "Bringing quality to your doorstep",
    url: "https://kerafresh.co.uk/", // Replace with your actual website URL
    image:
      "https://res.cloudinary.com/dur9jryl7/image/upload/v1730159866/ba4f5139-5b65-4c7a-a84c-96bc0abbce85_ijwctn.png",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta property="og:title" content={metadata.openGraph.title} />
          <meta
            property="og:description"
            content={metadata.openGraph.description}
          />
          <meta property="og:url" content={metadata.openGraph.url} />
          <meta property="og:image" content={metadata.openGraph.image} />
          <meta property="og:type" content={metadata.openGraph.type} />
        </head>
        <body className={font.className}>
          <ToastProvider />
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
