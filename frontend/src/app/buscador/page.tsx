import { Suspense } from "react";
import BuscadorClient from "./BuscadorClient";

export default function PaginaBuscador() {
  return (
    <Suspense
      fallback={
        <div className="page page-home" style={{ minHeight: "100vh" }}>
          Cargando buscador...
        </div>
      }
    >
      <BuscadorClient />
    </Suspense>
  );
}
