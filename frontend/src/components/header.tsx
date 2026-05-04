"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MenuTienda from "@/components/cart/bar"
import { useEffect, useState } from "react";
import { getTipoFromToken } from "../components/utils/auth";


export default function Header() {
  const pathname = usePathname();
  const rutasMenuTienda = ["/productos", "/panel-cliente", "/tiendas", "/carrito"];
  const [tipo, setTipo] = useState<string | null>(null);

  useEffect(() => {
    setTipo(getTipoFromToken());
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <header className="header" >
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
            <p className="brand-subtitle">Comercio local a un clic</p>
          </div>
        </Link>


        

          {/* sin user */}
          {!tipo && (
            <>

              <nav className="menu">
              <Link href="/about">Quienes Somos</Link>
              <a href="#eventos">Eventos</a>
              <Link href="/buscador">Buscador</Link>
              </nav>
               <div className="actions">
              <Link href="/acceso/registro" className="btn btn-primary">Empezar</Link>
              <Link href="/acceso/login" className="btn btn-primary">Iniciar Sesión</Link>
              </div>
            </>
          )}

          
          {tipo === "usuario" && (
            <>
            <nav className="menu">
              <Link href="/buscador">Buscador</Link>
              <Link href="/solicitar-ayuda">Solicitar Ayuda</Link>
              <Link href="/tiendas">Tienda</Link>
              <Link href="/panel-cliente">Mi Panel</Link>
              <Link href="/lista_Servicios">Servicios</Link>
              <Link href="/carrito">Carrito</Link>
              </nav>
              <div className="actions">
              <button onClick={logout}>Logout</button>
              </div>
            </>
          )}

          
          {tipo === "comercio" && (
            <>
            <nav className="menu">
              <Link href="/buscador">Buscador</Link>
              <Link href="/panel-comercio" >Mi panel</Link>
              <Link href="/productos">Mis Productos</Link>
              </nav>
              <div className="actions">
              <button onClick={logout} className="btn btn-primary">Logout</button>
              </div>
            </>
          )}

          
          {tipo === "superuser" && (
            <>
            <nav className="menu">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/registroServicio">Servicios</Link>
              <Link href="/about">Quienes Somos</Link>
              <Link href="#eventos">Eventos</Link>
              <Link href="/buscador">Buscador</Link>
              <Link href="/tiendas">Tienda</Link>
              <Link href="/panel-cliente">Panel Cliente</Link>
              <Link href="/carrito">Carrito</Link>  
              <Link href="/panel-comercio" >Panel Comercio</Link>
              <Link href="/productos">Productos</Link>
              </nav>
              <div className="actions">
              <button onClick={logout} className="btn btn-primary">Logout</button>
              </div>
            </>
          )}

        

      </div>
      {rutasMenuTienda.includes(pathname) && <MenuTienda />}
    </header>
  )


}