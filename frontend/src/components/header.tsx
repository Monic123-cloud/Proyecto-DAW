"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MenuTienda from "@/components/cart/bar";
import { useEffect, useState } from "react";
import { getTipoFromToken } from "../components/utils/auth";
import { Button, Stack } from "@mui/material";

export default function Header() {
  const pathname = usePathname();
  const rutasMenuTienda = [
    "/productos",
    "/panel-cliente",
    "/tiendas",
    "/carrito",
  ];
  const [tipo, setTipo] = useState<string | null>(null);

  useEffect(() => {
    const updateTipo = () => {
      const tipo = getTipoFromToken();
      setTipo(tipo);
    };

    updateTipo();
    console.log("TIPO:", getTipoFromToken());
    window.addEventListener("storage", updateTipo);

    return () => {
      window.removeEventListener("storage", updateTipo);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand">
          <Image
            src="/images/Close-logo_1.png"
            alt="Logo Close4u"
            width={56}
            height={56}
            className="brand-logo-img"
            priority
          />

          <div className="brand-text-block">
            <Image
              src="/images/Close4up-logo_2.png"
              alt="Close4u"
              width={100}
              height={36}
              className="brand-name-img"
              priority
            />
            <p className="brand-subtitle">Comercio local a un click</p>
          </div>
        </Link>

        {/* sin user */}
        {!tipo && (
          <>
            <nav className="menu">
              <Link href="/about">Quienes Somos</Link>
              <Link href="/buscador">Buscador</Link>
              <Link href="/registro-ayuda">Solicitar Ayuda</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
            <div className="actions">
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  href="/acceso/login"
                  variant="contained"
                  sx={{
                    fontSize: "0.95rem",
                    letterSpacing: "0.3px",
                    px: 3,
                    backgroundColor: "transparent",
                    color: "#9A84E8",
                    border: "2px solid #B8A1F7",
                    "&:hover": {
                      backgroundColor: "#F1EDFF",
                    },
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  component={Link}
                  href="/acceso/menu_registro"
                  variant="contained"
                  sx={{
                    fontSize: "0.95rem",
                    letterSpacing: "0.3px",
                    px: 6,
                    backgroundColor: "#B8A1F7",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#9A84E8",
                    },
                  }}
                >
                  Registro
                </Button>
              </Stack>
            </div>
          </>
        )}

        {tipo === "usuario" && (
          <>
            <nav className="menu">
              <Link href="/buscador">Buscador</Link>
              <Link href="/registro-ayuda">Solicitar Ayuda</Link>
              <Link href="/tiendas">Tienda</Link>
              <Link href="/panel-cliente">Mi Panel</Link>
              <Link href="/lista_Servicios">Servicios</Link>
              <Link href="/carrito">Carrito</Link>
            </nav>
            <div className="actions">
              <Button
                onClick={logout}
                variant="contained"
                sx={{
                  backgroundColor: "#B8A1F7",
                  color: "#fff",
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#9A84E8",
                  },
                }}
              >
                Logout
              </Button>
            </div>
          </>
        )}

        {tipo === "comercio" && (
          <>
            <nav className="menu">
              <Link href="/buscador">Buscador</Link>
              <Link href="/panel-comercio">Mi panel</Link>
              <Link href="/productos">Mis Productos</Link>
            </nav>
            <div className="actions">
              <Button
                onClick={logout}
                variant="contained"
                sx={{
                  backgroundColor: "#B8A1F7",
                  color: "#fff",
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#9A84E8",
                  },
                }}
              >
                Logout
              </Button>
            </div>
          </>
        )}

        {tipo === "superuser" && (
          <>
            <nav className="menu">
              <Link href="/registroServicio">Servicios</Link>
              <Link href="/about">Quienes Somos</Link>
              <Link href="/buscador">Buscador</Link>
              <Link href="/tiendas">Tienda</Link>
              <Link href="/panel-cliente">Panel Cliente</Link>
              <Link href="/carrito">Carrito</Link>
              <Link href="/panel-comercio">Panel Comercio</Link>
              <Link href="/productos">Productos</Link>
            </nav>
            <div className="actions">
              <button onClick={logout} className="btn btn-primary">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
      {rutasMenuTienda.includes(pathname) && <MenuTienda />}
    </header>
  );
}
