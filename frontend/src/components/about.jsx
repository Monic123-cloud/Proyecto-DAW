import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';


export default function About() {
  return (
    <ImageList
  sx={{ width: "100%", px: 4 }}
  cols={3}
  gap={24}
>
  {itemData.map((item) => (
    <ImageListItem
      key={item.img}
      cols={item.cols || 1}
  rows={item.rows || 1}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        "&:hover img": {
          transform: "scale(1.05)"
        }
      }}
    >
      <img
        src={item.img}
        alt={item.title}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "0.4s ease"
        }}
      />

      <ImageListItemBar
        title={item.title}
        subtitle={item.text}
        sx={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6), )",
          padding: "20px",

          "& .MuiImageListItemBar-title": {
            fontSize: "2rem",
            fontWeight: 600,
            letterSpacing: "-0.5px"
          },

          "& .MuiImageListItemBar-subtitle": {
            fontSize: "1.1rem",
            opacity: 0.9
          }
        }}
      />
    </ImageListItem>
  ))}
</ImageList>
  );
}

const itemData = [
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
