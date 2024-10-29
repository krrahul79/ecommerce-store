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
  Image:
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
