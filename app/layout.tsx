import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ToastProvider from "@/providers/toast-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Head from "next/head";

import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kerafresh",
  description: "Bringing quality to your doorstep",
  image:
    "https://res.cloudinary.com/dur9jryl7/image/upload/v1730159866/ba4f5139-5b65-4c7a-a84c-96bc0abbce85_ijwctn.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <meta property="og:title" content={metadata.title} />
          <meta property="og:description" content={metadata.description} />
          <meta property="og:image" content={metadata.image} />
          <meta property="og:url" content={window.location.href} />{" "}
          {/* You can modify this as needed */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metadata.title} />
          <meta name="twitter:description" content={metadata.description} />
          <meta name="twitter:image" content={metadata.image} />
        </Head>
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
