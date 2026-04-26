"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, onlyRole }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("knox_token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/acceso/login");
      return;
    }

    if (onlyRole && role !== onlyRole) {
      // si quieres: mandar a la home o a su panel correcto
      router.replace(role === "comercio" ? "/comercio" : "/cliente");
      return;
    }

    setReady(true);
  }, [router, onlyRole]);

  if (!ready) return null;
  return children;
}