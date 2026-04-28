'use client';

import { useEffect } from "react";
import ReactGA from "react-ga4";
import { usePathname, useSearchParams } from "next/navigation";

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inicializar Google Analytics una sola vez
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log("GA4 Inicializado con ID:", GA_MEASUREMENT_ID);
  }, [GA_MEASUREMENT_ID]);

  // Enviar un "pageview" cada vez que cambie la URL o los filtros de búsqueda
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();
    ReactGA.send({ 
      hitType: "pageview", 
      page: url,
      title: pathname 
    });
    
    // Esto es muy útil para ver en tiempo real si funciona
    console.log("Evento enviado a GA4:", url); 
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null; 
}