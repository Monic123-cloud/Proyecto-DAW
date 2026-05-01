"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const items = [
  {
    img: "/images/background_.jpg",
    title: "Personas",
    text: "Conectamos vecinos con comercios, productores y servicios cercanos.",
  },
  {
    img: "/images/neelam279-raindrop-10190084.jpg",
    title: "Medio ambiente",
    text: "Impulsamos un consumo más cercano y responsable.",
  },
  {
    img: "/images/henning_w-team-386673.jpg",
    title: "Comunidad",
    text: "Creemos en el poder de los barrios y la colaboración.",
  },
  {
    img: "/images/rgy23-amboise-3898478.jpg",
    title: "Negocios locales",
    text: "Damos visibilidad a comercios que muchas veces pasan desapercibidos.",
  },
  {
    img: "/images/pixelwanderer-tree-planting-10188876.jpg",
    title: "Impacto positivo",
    text: "Favorecemos una forma de consumir más conectada con la zona.",
  },
];

export default function About() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(255, 245, 172, 0.14), rgba(178, 216, 178, 0.2)), url('/images/bg-about.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 7 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1180px",
          mx: "auto",
          borderRadius: { xs: "28px", md: "42px" },
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "0 24px 70px rgba(31,108,26,0.18)",
          p: { xs: 2, md: 4 },
        }}
      >
        {/* CABECERA + MOSAICO */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: { xs: 3, md: 5 },
            alignItems: "center",
            mb: 5,
          }}
        >
          <Box>
            <Typography
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.8,
                borderRadius: "999px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#047857",
                fontWeight: 900,
                fontSize: "0.85rem",
                mb: 2,
              }}
            >
              Consumo local · Cercanía · Economía circular
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.4rem", md: "4.6rem" },
                lineHeight: 1.03,
                letterSpacing: "-0.055em",
                fontWeight: 950,
                color: "#005338",
                mb: 2,
              }}
            >
              Sobre nosotros
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                color: "#334155",
                fontSize: "1.08rem",
                lineHeight: 1.75,
                fontWeight: 500,
              }}
            >
              Close4u nace para acercar el comercio local a las personas. Una
              plataforma pensada para encontrar productos, servicios y negocios
              cercanos de forma rápida, sencilla y útil.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
              <Button
                component={Link}
                href="/buscador"
                sx={{
                  borderRadius: "18px",
                  px: 3,
                  py: 1.3,
                  background: "#d1b3ff",
                  color: "white",
                  fontWeight: 900,
                  textTransform: "none",
                  "&:hover": { background: "#c39cff" },
                }}
              >
                Ir al buscador
              </Button>

              <Button
                component={Link}
                href="/acceso/registro"
                sx={{
                  borderRadius: "18px",
                  px: 3,
                  py: 1.3,
                  background: "white",
                  color: "#005338",
                  fontWeight: 900,
                  textTransform: "none",
                  border: "1px solid #dbe4ea",
                  "&:hover": { background: "#f8fafc" },
                }}
              >
                Únete ahora
              </Button>
            </Box>
          </Box>

          {/* MOSAICO PRINCIPAL: 1 grande + 2 pequeñas */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1.5,
              height: { xs: "auto", md: 520 },
            }}
          >
            {items.slice(0, 3).map((item, index) => (
              <ImageCard key={item.title} item={item} index={index} />
            ))}
          </Box>
        </Box>

        {/* BLOQUE QUIÉNES SOMOS */}
        <Box
          sx={{
            borderRadius: "30px",
            background: "linear-gradient(135deg, #1abc8a, #0f9f73)",
            color: "white",
            p: { xs: 3, md: 5 },
            mb: 4,
            boxShadow: "0 18px 45px rgba(16,185,129,0.24)",
          }}
        >
          <Typography
            sx={{
              color: "#d1fae5",
              fontSize: "0.82rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              mb: 1,
            }}
          >
            Quiénes somos
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.1,
              fontWeight: 950,
              mb: 2,
              color: "white",
            }}
          >
            Una iniciativa para dar vida al comercio de proximidad
          </Typography>

          <Typography
            sx={{
              maxWidth: 900,
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Creemos en un modelo más cercano, donde los vecinos puedan encontrar
            lo que necesitan en su propia zona y los pequeños negocios tengan
            más visibilidad digital.
          </Typography>
        </Box>

        {/* MOSAICO SECUNDARIO + MISIÓN */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1.5,
            }}
          >
            {items.map((item) => (
              <SmallCard key={item.title} item={item} />
            ))}
          </Box>

          <Box
            sx={{
              borderRadius: "30px",
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(15,23,42,0.08)",
              p: { xs: 3, md: 4 },
              boxShadow: "0 14px 34px rgba(31,108,26,0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#059669",
                fontSize: "0.82rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                mb: 1,
              }}
            >
              Nuestra misión
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.9rem", md: "2.6rem" },
                lineHeight: 1.1,
                fontWeight: 950,
                color: "#005338",
                mb: 2,
              }}
            >
              Hacer más accesible el comercio local
            </Typography>

            <MissionItem
              title="Para vecinos"
              text="Encuentran productos y servicios cercanos sin perder tiempo."
            />

            <MissionItem
              title="Para comercios"
              text="Ganan visibilidad y pueden mostrar mejor su oferta."
            />

            <MissionItem
              title="Para el barrio"
              text="Se fomenta un consumo más cercano, útil y conectado."
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ImageCard({
  item,
  index,
}: {
  item: { img: string; title: string; text: string };
  index: number;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 220, md: index === 0 ? 520 : 250 },
        gridRow: { md: index === 0 ? "span 2" : "auto" },
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 16px 36px rgba(0,0,0,0.14)",
        border: "8px solid rgba(255,255,255,0.92)",
        background: "#0f172a",
      }}
    >
      <Box
        component="img"
        src={item.img}
        alt={item.title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.45s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: "auto 0 0 0",
          p: 2,
          pt: 7,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.36), transparent)",
          color: "white",
        }}
      >
        <Typography
          sx={{
            fontWeight: 950,
            fontSize: "1.3rem",
            mb: 0.4,
            color: "white",
            textShadow: "0 2px 8px rgba(0,0,0,0.55)",
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.95)",
            fontWeight: 700,
            textShadow: "0 2px 8px rgba(0,0,0,0.55)",
          }}
        >
          {item.text}
        </Typography>
      </Box>
    </Box>
  );
}

function SmallCard({
  item,
}: {
  item: { img: string; title: string; text: string };
}) {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        background: "rgba(255,255,255,0.9)",
        overflow: "hidden",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 10px 28px rgba(31,108,26,0.1)",
      }}
    >
      <Box
        component="img"
        src={item.img}
        alt={item.title}
        sx={{
          width: "100%",
          height: 160,
          objectFit: "cover",
          display: "block",
        }}
      />

      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 950, color: "#005338", mb: 0.6 }}>
          {item.title}
        </Typography>

        <Typography
          sx={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.55 }}
        >
          {item.text}
        </Typography>
      </Box>
    </Box>
  );
}

function MissionItem({ title, text }: { title: string; text: string }) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, mt: 2.2 }}>
      <Box sx={{ color: "#10b981", fontWeight: 950 }}>✓</Box>

      <Box>
        <Typography sx={{ fontWeight: 950, color: "#005338" }}>
          {title}
        </Typography>

        <Typography sx={{ color: "#475569", mt: 0.4 }}>{text}</Typography>
      </Box>
    </Box>
  );
}
