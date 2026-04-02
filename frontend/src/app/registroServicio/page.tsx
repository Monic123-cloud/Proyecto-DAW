"use client";

import RegistroServicio from "../../components/RegistroServicio";

export default function PaginaRegistroServicio() {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Alta de Profesionales y Servicios</h1>
      <RegistroServicio />
    </div>
  );
}