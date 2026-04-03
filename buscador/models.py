import requests
import googlemaps
from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone


class DetallePedido(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(
        "Pedido", on_delete=models.CASCADE, db_column="id_pedido", blank=True, null=True
    )
    id_producto = models.ForeignKey(
        "Producto", models.CASCADE, db_column="id_producto", blank=True, null=True
    )
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        managed = True
        db_table = "detalle_pedido"


class Establecimiento(models.Model):
    TIPO_NEGOCIO_CHOICES = [
        ("comercio", "Comercio"),
        ("productor", "Productor Local"),
    ]
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True
    )

    id_establecimiento = models.AutoField(primary_key=True)
    nombre_comercio = models.CharField(max_length=255)
    cif_nif = models.CharField(max_length=20, unique=True, verbose_name="CIF/NIF")
    tipo_negocio = models.CharField(
        max_length=20, choices=TIPO_NEGOCIO_CHOICES, default="comercio"
    )
    grupo = models.CharField(max_length=100, null=True, blank=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    subcategoria = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.CharField(max_length=100, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    cp = models.CharField(max_length=10, blank=True, null=True)
    latitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )
    longitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )
    url_web = models.CharField(max_length=255, blank=True, null=True)

    @property
    def promedio_valoraciones(self):
        from django.db.models import Avg
        # Calculamos la media de las valoraciones relacionadas
        promedio = self.valoraciones.aggregate(Avg('puntuacion'))['puntuacion__avg']
        return round(promedio, 1) if promedio else 0

    @property
    def numero_valoraciones(self):
        return self.valoraciones.count()

    class Meta:
        managed = True
        db_table = "establecimiento"

    def save(self, *args, **kwargs):
        if (self.direccion or self.cp) and not (self.latitud and self.longitud):
            self.geocodificar()
        super().save(*args, **kwargs)

    def geocodificar(self):
        try:
            if not settings.GOOGLE_MAPS_API_KEY:
                print("Falta la API KEY de Google Maps")
                return
            gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
            componentes = [
                self.direccion or "",
                self.numero or "",
                self.cp or "",
                self.municipio or "",
                "España",
            ]
            direccion_completa = ", ".join([c for c in componentes if c])

            result = gmaps.geocode(direccion_completa)
            if result:
                location = result[0]["geometry"]["location"]
                self.latitud = location["lat"]
                self.longitud = location["lng"]
                print(f"Éxito geocodificando: {self.nombre_comercio}")
        except Exception as e:
            print(f"Error con Google Maps API: {e}")


class Evento(models.Model):
    id_evento = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey("Usuario", models.CASCADE, db_column="id_usuario")
    nombre_evento = models.CharField(max_length=255)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    lugar = models.CharField(max_length=255, blank=True, null=True)
    publico_objetivo = models.CharField(max_length=255, blank=True, null=True)
    rol_evento = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "evento"


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    id_establecimiento = models.ForeignKey(
        Establecimiento,
        models.CASCADE,
        db_column="id_establecimiento",
        blank=True,
        null=True,
    )
    id_usuario = models.ForeignKey("Usuario", models.CASCADE, db_column="id_usuario")
    importe_total = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )
    fecha = models.DateTimeField(auto_now_add=True)
    metodo_pago = models.CharField(max_length=50, blank=True, null=True)
    descuento = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )
    metodo_entrega = models.CharField(max_length=50, blank=True, null=True)
    estado = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "pedido"


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_establecimiento = models.ForeignKey(
        Establecimiento,
        models.CASCADE,
        db_column="id_establecimiento",
        blank=True,
        null=True,
    )
    tipo_producto = models.CharField(max_length=100, blank=True, null=True)
    producto = models.CharField(max_length=255)
    stock = models.IntegerField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        managed = True
        db_table = "producto"


class Servicio(models.Model):
    id_servicio = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey("Usuario", models.CASCADE, db_column="id_usuario")
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    precio_hora = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    lat = models.DecimalField(max_digits=12, decimal_places=9, blank=True, null=True)
    lng = models.DecimalField(max_digits=12, decimal_places=9, blank=True, null=True)
    cp = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "servicio"


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    correo = models.CharField(unique=True, max_length=150)
    auth_id = models.CharField(unique=True, max_length=255)
    sexo = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    piso = models.CharField(max_length=10, blank=True, null=True)
    letra = models.CharField(max_length=10, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    cp = models.CharField(max_length=10, blank=True, null=True)
    latitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )
    longitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )

    class Meta:
        managed = True
        db_table = "usuario"


class Valoracion(models.Model):
    id_valoracion = models.AutoField(primary_key=True)
    id_establecimiento = models.ForeignKey(
        Establecimiento,
        models.CASCADE,
        db_column="id_establecimiento",
        related_name="valoraciones",
        blank=True,
        null=True,
    )
    id_usuario = models.ForeignKey(
        Usuario, models.CASCADE, db_column="id_usuario", blank=True, null=True
    )
    # Validamos que solo sea de 1 a 5
    puntuacion = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, null=True
    )
    fecha = models.DateTimeField(auto_now_add=True)
    comentario = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "valoracion"
        unique_together = ("id_establecimiento", "id_usuario")

class Voluntario(models.Model):
    usuario = models.OneToOneField('usuario', on_delete=models.CASCADE, related_name='perfil_voluntario')
    cp = models.CharField(max_length=5)
    dias_disponibles = models.CharField(max_length=100) 
    horario_inicio = models.TimeField()
    horario_fin = models.TimeField()
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'voluntario' # Nombre para la nueva tabla

class SolicitudAyuda(models.Model):
    nombre_completo = models.CharField(max_length=150)
    telefono = models.CharField(max_length=15)
    email = models.EmailField()
    cp = models.CharField(max_length=5)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_nacimiento = models.DateField() 
    encuesta_enviada = models.BooleanField(default=False)
    requiere_llamada = models.BooleanField(default=False)
    puntuacion = models.IntegerField(null=True, blank=True)

    @property
    def es_persona_mayor(self):
        # Consideramos mayor a +65 años
        return (timezone.now().date() - self.fecha_nacimiento).days > (65 * 365)

    class Meta:
        db_table = 'solicitud_ayuda'

class EncuestaSatisfaccion(models.Model):
    # Relación con la solicitud original
    solicitud = models.OneToOneField(SolicitudAyuda, on_delete=models.CASCADE, related_name='encuesta')
    
    # Preguntas de la encuesta
    puntuacion = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) # 1 a 5 estrellas
    comentario = models.TextField(blank=True, null=True)
    fecha_completada = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'encuesta_satisfaccion'