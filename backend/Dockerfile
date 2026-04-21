# 1. Imagen base
FROM python:3.11-slim

# 2. Variables de entorno básicas
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Directorio de trabajo
WORKDIR /app
ENV PYTHONPATH=/app

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

# 7. Puerto 
ENV PORT 8080

# 8. Comando de arranque real con Gunicorn
CMD python manage.py collectstatic --noinput && \
    python manage.py migrate && \
    python manage.py createsuperuser --noinput || true && \
    gunicorn config.wsgi:application --bind 0.0.0.0:$PORT