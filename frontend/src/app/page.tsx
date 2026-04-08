import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import Buscador from "../components/Buscador";
import Header from "@/components/header";
import Mapa from "@/components/Mapa";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { IconButton } from "@mui/material";

export default function HomePage() {
  const categories = [
    {
      title: "Alimentación",
      desc: "Panaderías, fruterías, carnicerías y tiendas gourmet cerca de ti.",
      icon: "🥖",
    },
    {
      title: "Bienestar",
      desc: "Peluquerías, estética, fisioterapia y servicios de cuidado personal.",
      icon: "💆",
    },
    {
      title: "Hogar",
      desc: "Arreglos, limpieza, ferretería y profesionales de confianza del barrio.",
      icon: "🏠",
    },
    {
      title: "Mascotas",
      desc: "Tiendas, peluquería canina y servicios para el bienestar animal.",
      icon: "🐾",
    },
  ];

  const benefits = [
    "Encuentra productos y servicios cercanos en segundos.",
    "Apoya al comercio local y a nuevos emprendedores.",
    "Reduce desplazamientos innecesarios y gana tiempo.",
    "Descubre lo que realmente necesitas en tu zona.",
  ];

  const merchants = [
    {
      name: "La Huerta de Barrio",
      type: "Frutería local",
      distance: "A 4 min",
      description: "Productos frescos, trato cercano y reparto de proximidad.",
    },
    {
      name: "Studio Zen",
      type: "Centro de bienestar",
      distance: "A 7 min",
      description: "Servicios de estética y bienestar con reserva rápida.",
    },
    {
      name: "Arreglos Express",
      type: "Servicios del hogar",
      distance: "A 9 min",
      description:
        "Pequeñas reparaciones y asistencia rápida para tu día a día.",
    },
  ];

  return (
    <div className="page page-home">
      <Header />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="badge">
                Consumo local • Cercanía • Economía circular
              </span>

              <h1 className="hero-title">
                Todo lo que necesitas,
                <span> más cerca de ti</span>
              </h1>

              <div className="hero-text-card">
                <p className="hero-text">
                  Close4u conecta a vecinos con comercios, productores y
                  servicios locales para que encuentren de forma rápida lo que
                  necesitan en su zona, ahorrando tiempo y fortaleciendo el
                  barrio.
                </p>
              </div>

              <div className="hero-actions">
                <Link href="/acceso/registro" className="btn btn-primary">
                  Soy cliente
                </Link>
                <Link
                  href="/registroM"
                  className="btn btn-secondary"
                >
                  Soy comercio
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">

              {/* Móvil con mapa */}
              <div className="phone-wrap">
                <div className="phone-card">
                  <div className="phone-screen">
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      <Mapa puntos={[]} />
                      <Link
                        href="/buscador"
                      >
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            backgroundColor: "#1abc8a",
                            color: "white",
                            border: "3px solid white",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            "&:hover": {
                              backgroundColor: "#17a97c",
                              transform: "scale(1.05)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <FullscreenIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>

        <section id="servicios" className="section">
          <div className="container">
            <div className="section-intro">
              <p className="section-tag">Servicios</p>
              <h2>Una plataforma pensada para simplificar tu día a día</h2>
              <p>
                Busca lo que necesitas, encuentra opciones cercanas y elige en
                segundos. Sin rodeos, sin perder tiempo y con más apoyo al
                comercio de proximidad.
              </p>
            </div>

            <div className="grid-3">
              <div className="card">
                <span className="step">01</span>
                <h3>Busca</h3>
                <p>
                  Introduce un producto o servicio y localiza opciones cerca de
                  ti.
                </p>
              </div>

              <div className="card">
                <span className="step">02</span>
                <h3>Compara</h3>
                <p>
                  Consulta negocios, horarios, cercanía y disponibilidad de un
                  vistazo.
                </p>
              </div>

              <div className="card">
                <span className="step">03</span>
                <h3>Conecta</h3>
                <p>
                  Contacta, reserva o compra apoyando a comercios de tu entorno.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="tiendas" className="section section-alt">
          <div className="container">
            <div className="section-head">
              <div className="section-intro">
                <p className="section-tag">Tiendas</p>
                <h2>Encuentra lo que necesitas según tu momento</h2>
              </div>
              <p className="section-side-text">
                Desde alimentación y bienestar hasta servicios cotidianos para
                el hogar. Todo reunido en una experiencia clara y rápida.
              </p>
            </div>

            <div className="grid-4">
              {categories.map((item) => (
                <div key={item.title} className="card category-card">
                  <div className="category-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="productos" className="section">
          <div className="container two-cols">
            <div>
              <div className="section-intro">
                <p className="section-tag">productos</p>
                <h2>
                  Una app útil para vecinos, comercios y nuevos emprendedores
                </h2>
              </div>

              <div className="benefits">
                {benefits.map((benefit) => (
                  <div key={benefit} className="card benefit-card">
                    <span className="check">✔</span>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="business-box">
              <p className="business-tag">Para negocios locales</p>
              <h3>Gana visibilidad sin perder tu esencia</h3>
              <p>
                Close4u ayuda a los comercios de barrio a estar donde hoy
                empieza casi todo: en la búsqueda digital. Más visibilidad, más
                cercanía y más oportunidades reales de crecer.
              </p>
              <Link href="/registroM" className="btn btn-light">
                Unir mi negocio
              </Link>
              
            </div>
          </div>
        </section>
      </main>

      <footer id="contacto" className="footer">
        <div className="container footer-inner">
          <div>
            <p className="brand-title">Close4u</p>
            <p className="brand-subtitle">
              Conectando personas con comercio local de proximidad.
            </p>
          </div>

          <div className="footer-links">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
