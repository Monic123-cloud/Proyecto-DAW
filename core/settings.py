from pathlib import Path  # Para python manage.py migrate rutas de archivos
from dotenv import load_dotenv  # busca un archivo secreto llamado .env y lo carga
import environ  # permite leer variables y decirles qué tipo de dato son
import dj_database_url  # permite configurar la base de datos usando una URL, útil para despliegues como Railway
import os  # permite que Python lea los valores .env

env = environ.Env(DEBUG=(bool, False))
BASE_DIR = (
    Path(__file__).resolve().parent.parent
)  # BASE_DIR utilizando la librería pathlib para obtener la ruta absoluta de la raíz del proyecto de forma dinámica

if os.path.exists(os.path.join(BASE_DIR, ".env")):
    environ.Env.read_env(
        os.path.join(BASE_DIR, ".env")
    )  # lo separa en partes y lo carga, para que luego podamos usarlo con env("NOMBRE_VARIABLE") por seguridad

GOOGLE_MAPS_API_KEY = os.getenv(
    "GOOGLE_MAPS_API_KEY"
)  # Busca en el sistema operativo una variable llamada así


# Pongo los datos de mi fichero .env
SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")


# Es donde le dices al sistema qué módulos debe cargar para que tu aplicación tenga las funcionalidades que necesitas
# Añado buscador
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "buscador",
]

# filtros por los que pasa cada petición desde que llega al servidor hasta que llega a tus vistas, y también cuando la respuesta vuelve al usuario.
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"  # indica a Django cuál es el archivo maestro que debe consultar para saber qué hacer cada vez que alguien escribe una dirección en el navegador.

# configuración que le dice a Django cómo y dónde debe buscar los archivos HTML para renderizarlos
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"  # (Web Server Gateway Interface) es un estándar que define cómo los servidores web se comunican con las aplicaciones web. En Django, el archivo wsgi.py es el punto de entrada para las solicitudes HTTP cuando se despliega la aplicación en un servidor compatible con WSGI.


# Database. Intenta usar la URL de la base de datos proporcionada por Railway, si no está disponible, usa variables de .env
db_from_env = env.db_url("DATABASE_URL", default=None)

if db_from_env:
    # Si estamos en Railway, esto configura todo automáticamente (host, user, pass...)
    DATABASES = {
        "default": dj_database_url.config(default=env("DATABASE_URL"), conn_max_age=600)
    }
else:
    # Si no hay DATABASE_URL, usamos la configuración local de PostgreSQL
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("DB_NAME", default="tu_db_nombre"),
            "USER": env("DB_USER", default="tu_usuario"),
            "PASSWORD": env("DB_PASSWORD", default=""),
            "HOST": env("DB_HOST", default="localhost"),
            "PORT": env("DB_PORT", default="5432"),
        }
    }

# reglas que deben cumplir las contraseñas de los usuarios
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# almacenamiento de estáticos mediante WhiteNoise, que permite servir los archivos estáticos directamente desde el servidor de Django sin necesidad de configurar un servidor web adicional como Nginx o Apache. Además, WhiteNoise comprime y cachea los archivos estáticos para mejorar el rendimiento.
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"  # Define el tipo de dato para las "Primary Keys" (IDs) de las tablas.

# En lugar de enviar la contraseña en cada petición, el usuario se loguea una vez, recibe un "token" y lo usa para identificarse después.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
}
# Este es el "derecho de admisión" del servidor
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://app-comercio-red.vercel.app",
    "https://app-comercio-git-main-monic123-clouds-projects.vercel.app",
]
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# para usar Tokens
CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60), # El token dura 1 hora
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),    # Permite renovarlo durante 1 día
    "AUTH_HEADER_TYPES": ("Bearer",),               # El prefijo que usará React
}
