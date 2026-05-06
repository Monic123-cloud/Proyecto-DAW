import Providers from "../components/providers/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/header";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
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
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <Suspense fallback={null}>
            {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
          </Suspense>

          <Providers>
            <Header />
            <main>{children}</main>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
