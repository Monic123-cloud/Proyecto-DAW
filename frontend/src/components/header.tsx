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
          <Link href="/#servicios">Servicios</Link>
          <Link href="/about">Quienes Somos</Link>
          <Link href="/tiendas">Tiendas</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/carrito">Carrito</Link>
          <Link href="/panel-cliente">Panel cliente</Link>
          <Link href="/panel-comercio">Panel comercio</Link>
          <Link href="/#eventos">Eventos</Link>
          <Link href="/#valoraciones">Valoraciones</Link>
          <Link href="/buscador">Buscador</Link>
        </nav>

        <Link href="/acceso/registro" className="btn btn-primary">
          Empezar
        </Link>
        <Link href="/acceso/login" className="btn btn-primary">
          Iniciar Sesión
        </Link>

      </div>
    </header>
  )


}