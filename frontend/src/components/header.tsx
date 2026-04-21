import Link from "next/link";
import Image from "next/image";


export default function Header(){
return(     
    <header className="header">
        <div className="container nav">
          <a href= "/" className="brand">
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
          </a>

          <nav className="menu">
            <a href="#servicios">Servicios</a>
            <a href="/about">¿Quienes Somos?</a>
            <a href="#tiendas">Tienda Online</a>
            <a href="#eventos">Eventos</a>
            <a href="#valoraciones">Valoraciones</a>
            <a href="/buscador">Buscador</a>
            
            
            
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