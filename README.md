# 🚀 Proyecto DAW: AppComercios

Aplicación de contactos de usuarios, comercios y productores de Proximidad

## 👥 Equipo y Contacto

- \*\*Mónica Blanco -- 224J5496
- \*\*Iván Gascón -- 224F4743
- \*\*Javier Rodriguez -- 224A5362

## Índice

    Justificación proyecto
    Objetivos
        Objetivo general
        Objetivos específicos
    Producto mínimo viable
    Metodología
    Diseño BBDD
    Arquitectura del diseño
    Diagrama de Gannt
    Diagrama de flujo
    Diagrama de Casos de Uso
    Diseño App (UI)

## Justificación del proyecto:

En una sociedad que prioriza y da valor a la gestión de su tiempo, creamos una aplicación donde ponga al alcance de todos, los productos y servicios cotidianos de primera necesidad y de bienestar en tu zona más próxima
Ponemos en contacto a los productores y emprendedores locales que nos permite obtener los productos de mayor calidad sin necesidad de desplazamientos innecesarios, sin apenas intermediarios
Priorizamos los comercios de barrio y todos aquellos servicios que nos pueden ofrecer nuestros propios vecinos
Detectamos para nuevos emprendedores, ideas y necesidades reales que faltan y que más se demandan en tu zona
Conectamos y creamos una red donde podamos poner al alcance productos y servicios, de forma sencilla y cercana
Creamos acciones sociales de voluntariado para aquellos vecinos que más lo necesiten

![Tablero Scrum](./img/DAFO.png)

## Objetivos:

    • Objetivo General:
    Crear un espacio donde dispongas de todos los servicios que necesitas a tu alcance
    • Objetivos específicos:
    o Relacionar y poner en contacto consumidores, empresas y productores locales
    o Diseñar una interfaz sencilla y amigable con todas las funcionalidades necesarias para los usuarios
    o Desarrollar un sistema CRUD completo, que sea robusto y seguro

• Scrum board

![Tablero Scrum](./img/scrumBoardPlanificacion.png)
![Tablero Scrum](./img/scrumBoardAnálisisDiseño.png)
![Tablero Scrum](./img/scrumBoardDesarrollo.png)
![Tablero Scrum](./img/scrumBoardPruebasDesPliegue.png)

https://miro.com/welcomeonboard/QlptZDU1ZXl1SWJDeUp0RGtESlhlTU1aVk5zZHh6Snp4ak0zckgzdVJRMk5laC84MXdFV1lrN2c2bGRaNW5qWS8wdUFlVUpXN1cvRVpSZ3M4SENGWTJDenVhOXJYVE9oVlFTc2IvUDZ1RzVLdklYM29sak5TY2YzRDVzbW5DU01Bd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=920105413377

## Producto mínimo viable

• Requisitos:
o Una web sencilla, visual y multidispositivo

        o  Se puede registrar un usuario

        o  Se registra un comercio

        o  Se registra los productores locales

        o  Opción Pedir domicilio

        o  Un usuario, un comercio y un productor tiene la opción de modificar y eliminar su registro

        o  Tiene buscador por zona y distancia

        o  Tiene un buscador de comercios

        o  Opción de visualizar en mapa

        o  Si no es usuario aparece Google Maps

        o  Si es usuario aparece Google maps y la propia de la web con datos y descuento

        o  Se puede seleccionar por CP, municipio o ciudad y km

        o  Menú por secciones

        o  Opción de descuento por ser usuario

        o  Ofrecer tus servicios

        o  Tener un check para participar en voluntariado

        o  Tienen valoraciones (estrellas)

        o  Sólo valoran usuarios registrados

        o  Disponer de buzón sugerencias ante falta de negocios o servicios

        o  Aplicación Responsive

        o  Disponer de la opción de enviar mensajes a los comercios

        o  Disponer de dashboard y métricas de entradas por sección de administrador

        o  Disponer de dashboard y métricas de entradas como comercio registrado

        o  Seguridad

        o  Disponer de servidores

        o  Disponer de dockers

        o  Página en inglés

        o  Página compatible para personas sordomudas

    • User Story:
        o Como usuario Quiero poder registrarme Para acceder a todas las funcionalidades.
        o Como usuario registrado Quiero iniciar sesion para acceder a mi cuenta.
        o Como usuario registrado Quiero editar o eliminar mi cuenta Para tener control sobre mi información personal.
        o Como comercio local Quiero editar o eliminar mi negocio Para tener control sobre mi negocio y poder ofrecer mis servicios o productos adecuadamente.
        o Como comercio local Quiero registrar mi comercio Para poder ofrecer mis productos o servicios.
        o Como comercio local Quiero registrar y editar mis productos o servicios Para poder actualizarme según las necesidades del mercado.
        o Como usuario Quiero buscar servicios cerca de mi Para satisfacer mis necesidades.
        o Como usuario Quiero ver servicios y comercios en un mapa Para saber su ubicación fácilmente.
        o Como usuario registrado Quiero poder valorar un comercio o servicio Para poder ayudar a otros.
        o Como usuario registrado Quiero poder enviar mensajes a comercios Para obtener información.
        o Como administrador Quiero ver métricas de uso Para mejorar el rendimiento de la plataforma.
        o Como comercio Quiero ver métricas de mi negocio Para ajustar mi negocio en base a estas.
        o Como usuario registrado Quiero comunicar mi deseo de participar en voluntariados Para colaborar con mi comunidad.
        o Como usuario registrado Quiero poder apuntarme a voluntariados Para poder colaborar con mi comunidad.

## Tecnologías Empleadas

    • Visual Studio Code: Es el editor de código abierto elegido para desarrollar todo el código fuente de nuestra aplicación. Esta decisión se debe a su compatibilidad con la mayoría de lenguajes de programación, y para nuestro caso todos los lenguajes que hemos decidido utilizar. Además, su control de versiones compatible con Git y Github.
        o Código Fuente
            • Frontend
                o HTML
                o CSS/Boostrap
                o Ts/React
            • Backend
                o Python/Django
                o SQL
    • GitHub: es nuestro repositorio central remoto en la nube para realizar un trabajo colaborativo y tener un control de versiones. En conjunto con Git y un desarrollo mediante ramas y commits para llevar el control de versiones y un desarrollo incremental mediante sprints.
    • Git: Es el software de código abierto que realizará el seguimiento de los cambios en nuestros archivos locales del proyecto para luego añadirlo a nuestro repositorio remoto en Github.
    • XAMPP: Software gratuito para la gestión de bases de datos a través de Apache, generando un servidor web local.
    • LucidChart: Aplicación web que usaremos para crear nuestros diagramas de manera colaborativa.
    • Google Drive: Almacenamiento seguro en la nube donde trabajaremos documentos de texto de forma colaborativa y compartiremos recursos bibliográficos.
    • Vercel: Es la plataforma que usaremos para el despliegue de nuestra aplicación, esta orientada en la nube y nos permite integrar nuestro repositorio Git.
    • phpMyAdmin: Utilizaremos está herramienta para la administración de nuestra base de datos y realizar nuestras consultas SQL.
    • Figma: Es la herramienta que vamos a usar para el diseño de interfaces y para realizar nuestros prototipos.

## Metodología

Estamos trabajando en el proyecto en Agile con estructura ligera estilo Scrum

    •  Nos permite dividir el trabajo en partes pequeñas y funcionales
    •  Flexibilidad y adaptación ante cualquier cambio necesario
    •  Cada entrega es funcional, por tanto el avance del proyecto es significativo
    •  Esto hace que cada tarea sea un progreso visible en el proyecto, lo que confirma que avanza y es más motivador
    •  Podemos detectar los errores según vayamos avanzando y no dejarlos para el final

La forma de trabajo que estamos teniendo es la siguiente:

    •  Dividimos en tareas pequeñas y concretas
    •  Tareas de 1-3 días
    •  Trabajamos en sprints de 1 semana
    •  Lista priorizada de todo lo que hay que hacer a nivel técnico en el proyecto
    •  Utilizando Git con ramas y commits frecuentes.
    •  Priorizaciones

## Diseño BBDD

Diseño Modelo Relacional

![Modelo Relacional](./img/Modelo_Relacionales.png)

Diseño Modelo Tablas Relacionales

![Tablas Relacionales](./img/Modelo_Tablas_relacionales.png)

## Arquitectura del proyecto

![Arquitectura del Proyecto](./arquitectura_appcomercio.png)

Basada la arquitectura en:

- **Frontend: React SPA alojada en **Vercel\*\*.
- **Backend:** Django API en **Railway** (Docker).
- **Seguridad:** Autenticación mediante **Tokens JWT**.
- **Base de Datos:** PostgreSQL independiente en Railway.

Frontend (Vercel): React.js con manejo de tokens JWT y Google Maps SDK.

Backend (Railway + Docker): Django + DRF configurado con CORS Headers para permitir la conexión desde Vercel.

Persistencia: Base de datos PostgreSQL alojada en Railway.

Comunicación mediante HTTPS / JSON (REST API) y consultas SQL vía psycopg2.

## Diagrama de Gannt

![Diagrama_Gannt](./img/Gannt_Diagram.png)

## Diagrama de flujo

![Diagrama_Flujo](./img/Diagrama_Flujo.png)

## Diagrama de Casos de Uso

![Diagrama_Casos_Uso](./img/Diagrama_Casos_Uso.png)

## Diseño App (UI)

    •	Página principal

![Main_Page](./img/Main_Page.png)

    •	Pagina para que se den alta usuarios y comerciantes

![User_Page](./img/User_Page.png)

    •	Interfaz la App (Versión 1)

![UI_App_V1](./img/UI_App_V1.png)

    •	Interfaz la App (Versión 2)

![UI_App_V2](./img/UI_App_V2.png)

    •	Diseño del header

![Header](./img/Header.png)

    •	Menús desplegables del header

![Menu_Header](./img/Menu_Header.png)

## Paleta de color de la App

    •	La armonía de los colores corporativos de la App se basa en una triada de color en tonos pastel:

        o	Menta (Mint): Transmite una conexión clara con la naturaleza y el bienestar. (Código HEX - #B2D8B2)

        o	Lavanda (Lavender): Transmite conexión con la comunidad y la creatividad. (Código HEX - #D1B3FF)

        o	Melocotón (Peach): Transmite acción y cercanía con una calidez optimista. (Código HEX – #FFCCAC)
