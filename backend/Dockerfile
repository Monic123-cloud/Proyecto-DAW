# 1. Imagen base
FROM python:3.11-slim

# 2. Variables de entorno básicas
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Directorio de trabajo
WORKDIR /app

# 4. INSTALACIÓN DE DEPENDENCIAS PARA POSTGRES (MUY IMPORTANTE)
# Instalamos libpq-dev para que la librería 'psycopg2' pueda compilarse
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Dependencias de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 6. Código del proyecto
COPY . /app/

#7. Ejecutar tareas de Django en build (NO en CMD)
RUN python manage.py collectstatic --noinput

# 8. Esto SIEMPRE en el CMD (Se ejecuta en el Deploy, con la DB real conectada)
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --timeout 120"]

