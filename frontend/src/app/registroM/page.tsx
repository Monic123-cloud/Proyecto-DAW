"use client";

import dynamic from "next/dynamic";

const RegistroEstablecimiento = dynamic(
  () => import("@/components/RegistroEstablecimiento"),
  { ssr: false },
);

export default function PaginaRegistro() {
  return (
    <div className="p-10">
      <RegistroEstablecimiento />
    </div>
  );
}
