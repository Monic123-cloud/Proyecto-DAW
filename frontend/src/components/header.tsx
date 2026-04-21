"use client";
import Link from "next/link";
import Image from "next/image";


export default function Header() {
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
          <Link href="/tiendas">Tienda Online</Link>
          <a href="#eventos">Eventos</a>
          <a href="#valoraciones">Valoraciones</a>
          <Link href="/buscador">Buscador</Link>
        </nav>

        <Link href="/acceso/registro" className="btn btn-primary">
          Empezar
        </Link>
        <Link href="/acceso/login" className="btn btn-primary">
          Inciar Sesion
        </Link>

      </div>
    </header>
  )


}