import Providers from "../components/providers/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/header";
import "./globals.css";
import { Suspense } from "react";

export const metadata = {
  title: "Close4u",
  description: "Comercio local a un click",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="es">
      <head></head>
      <body className="bg-light">
        {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}

        <Providers>
          <Suspense fallback={<div className="h-20" />}>
            <Header />
          </Suspense>

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
