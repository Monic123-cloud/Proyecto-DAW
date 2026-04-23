"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "./utils/utils";
import { useAuth } from "../components/context/AuthContext";

export default function Header() {
  const { isAuth, tipo, isSuperuser, logout } = useAuth();


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
            <p className="brand-subtitle">Comercio local a un clic</p>
          </div>
        </Link>

        <nav className="menu">
          <a href="#servicios">Servicios</a>
          <Link href="/about">Quienes Somos</Link>

          {/* 🔥 SUPERADMIN VE TODO */}
          {isSuperuser && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/admin">Admin Panel</Link>
              <Link href="/tiendas">Tienda Online</Link>
              <Link href="/mis-productos">Mis Productos</Link>
            </>
          )}

          {/* 🏪 COMERCIO */}
          {!isSuperuser && tipo === "comercio" && (
            <>
              <Link href="/dashboard">Mi Dashboard</Link>
              <Link href="/mis-productos">Mis Productos</Link>
            </>
          )}

          {/* 👤 USUARIO */}
          {!isSuperuser && tipo === "user" && (
            <>
              <Link href="/tiendas">Tienda Online</Link>
              <a href="#eventos">Eventos</a>
            </>
          )}

          <a href="#valoraciones">Valoraciones</a>
          <Link href="/buscador">Buscador</Link>
        </nav>



        <nav className="menu">
          <a href="#servicios">Servicios</a>
          <Link href="/about">Quienes Somos</Link>
          <Link href="/tiendas">Tienda Online</Link>
          <a href="#eventos">Eventos</a>
          <a href="#valoraciones">Valoraciones</a>
          <Link href="/buscador">Buscador</Link>
        </nav>

        {!isAuth ? (
          <>
            <Link href="/acceso/registro" className="btn btn-primary">
              Empezar
            </Link>
            <Link href="/acceso/login" className="btn btn-primary">
              Iniciar Sesion
            </Link>
          </>
        ) : (
          <button onClick={logout} className="btn btn-primary">
            Logout
          </button>
        )}

      </div>
    </header>
  )


}