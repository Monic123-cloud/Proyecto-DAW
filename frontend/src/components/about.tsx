"use client";
import { Box, Typography, Paper, styled } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { motion, Variants } from "framer-motion";
import { useState } from 'react';
import Link from 'next/link';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderRadius: "20px",
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.4)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
}));

const colors = {
  mint: "#B2D8B2",
  lavender: "#D1B3FF",
  peach: "#FFCCAC",
};
const bgColors = [colors.mint, colors.lavender, colors.peach, colors.mint];

export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  return (

    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          px: { xs: 2, sm: 4, md: 8 },
          py: 6,
          backgroundImage: "url('/images/bg-about.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            margin: "0 auto",
            borderRadius: { xs: 4, md: 6 },
            overflow: "hidden",
            background: `linear-gradient(135deg, #B2D8B2, #D1B3FF, #FFCCAC)`,
            p: { xs: 2, md: 4 },

          }}
        >
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Box
              sx={{
                textAlign: "center",
                mb: 6,
                px: { xs: 2, md: 4 },
                py: { xs: 3, md: 4 },

                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",

                borderRadius: "40px",
                border: "1px solid rgba(255,255,255,0.3)",

                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",

                color: "#2f2f2f",
                transition: "0.4s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,

                  background: `radial-gradient(
                        circle at ${mousePos.x}px ${mousePos.y}px,
                        rgba(255,255,255,0.4),
                        transparent 40%
                      )`,

                  opacity: 0,
                  transition: "opacity 0.3s",
                },

                "&:hover::before": {
                  opacity: 1,
                },
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: "#7B5FCF",
                  letterSpacing: "-0.8px",
                  lineHeight: 1.1,
                  textShadow: "0 2px 10px rgba(0,0,0,0.15)"
                }}>
                Sobre Nosotros
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Construimos un impacto positivo conectando personas, comunidad y sostenibilidad.
              </Typography>
            </Box>
          </motion.div>
          <Box
            sx={{
              alignItems: "flex-start",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 8 },
              mt: 6,
            }}
          >

            <Box sx={{ flex: 1 }}>


              <Box
                sx={{
                  width: 50,
                  height: 4,
                  background: "#B2D8B2",
                  borderRadius: 2,
                  mb: 2,
                }}
              />

              <Typography
                sx={{
                  color: "rgba(0,0,0,0.65)",
                  lineHeight: 1.7,
                  maxWidth: "700px",
                }}
              >

              </Typography>
            </Box>



          </Box>


          <ImageList variant="quilted" cols={3} gap={16}>
            {itemData.map((item, index) => (
              <ImageListItem
                key={index}
                cols={item.cols || 1}
                rows={item.rows || 1}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  "& img": {
                    transition: "transform 0.5s ease",
                  },
                  "&:hover img": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {item.custom ? (
                  <Box
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMousePos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                    sx={{
                      width: "100%",
                      height: "30vh",
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      background: "rgba(178,216,178,0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",

                      borderRadius: "20px",
                      color: "#0f5132",

                      transition: "0.4s",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,

                        background: `radial-gradient(
                        circle at ${mousePos.x}px ${mousePos.y}px,
                        rgba(255,255,255,0.4),
                        transparent 40%
                      )`,

                        opacity: 0,
                        transition: "opacity 0.3s",
                      },

                      "&:hover::before": {
                        opacity: 1,
                      },

                    }
                    }
                  >
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>

                    <Typography variant="h6">
                      {item.text}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,

                        px: 2,
                        pb: 3,
                        pt: 4,

                        background: "linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent 70%)",

                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: "2rem",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          wordBreak: "break-word",
                          textShadow: "0 2px 10px rgba(0,0,0,0.7)",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </ImageListItem>
            ))}
          </ImageList>

          <Box
            textAlign="center"
            mt={8}
            sx={{
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: 5,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",


            }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              ¿Quieres formar parte del cambio?
            </Typography>
            <Box
              component={Link}
              href="/acceso/registro"
              mt={3}
              sx={{
                display: "inline-block",
                background: "#FFCCAC",
                px: 4,
                py: 1.5,
                borderRadius: "999px",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 20px rgba(255,204,172,0.8)",
                },
              }}
            >
              Únete ahora
            </Box>
          </Box>
        </Box>
      </Box >
    </>


  );

}

const itemData = [
  {
    custom: true,
    title: "¿Quiénes somos?",
    text: "Somos una iniciativa enfocada en generar cambios reales a través de la comunidad promoviendo valores como la sostenibilidad, el apoyo local y el bienestar social.Creemos en el poder de las personas para transformar su entorno.",
    cols: 3,
    rows: 2,
  },
  {
    img: '/images/background_.jpg',
    title: 'Personas',
    text: 'Ponemos en primera prioridad a las personas y su bienestar',
    rows: 2,
    cols: 1,
    featured: true,
  },
  {
    img: '/images/neelam279-raindrop-10190084.jpg',
    title: 'Medio Ambiente',
    text: 'La razon del nacimiento de este proyecto para impulsar acciones mas responsables para nuestro planeta',
  },
  {
    img: '/images/henning_w-team-386673.jpg',
    title: 'Comunidad',
    text: 'Sabemos la importancia de la comunidad y nuestra idea es poder ayudar a fomentar su crecimiento',
  },
  {
    img: '/images/rgy23-amboise-3898478.jpg',
    title: 'Fomentar los negocios locales',
    text: 'Creemos en dar visibilidad aquello que tenemos cerca y muchas veces pasa desapercibido',

  },
  {
    img: '/images/pixelwanderer-tree-planting-10188876.jpg',
    title: 'Voluntariado',
    text: 'Queremos ayudar a contribuir al bienestar social y generar un impacto positivo.',

  },


];