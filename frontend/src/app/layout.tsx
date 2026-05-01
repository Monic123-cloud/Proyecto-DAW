
import  Providers  from "../components/providers/providers";

import "./globals.css";


export const metadata = {
  title: "Close4u",
  description: "Comercio local a un clic",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
      </head>
      <body className="bg-light">
        
        
        <Providers>{children}</Providers>
        
        
      </body>
    </html>
  );
}