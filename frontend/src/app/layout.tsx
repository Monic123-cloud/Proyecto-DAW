
import  Providers  from "../components/providers/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";


export const metadata = {
  title: "Close4u",
  description: "Comercio local a un click",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="es">
      <head>
      </head>
      <body className="bg-light">
        {/* 3. Renderizado condicional: solo si gaId tiene valor */}
        {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}