import requests
import googlemaps
from django.db import models
from django.conf import settings


class DetallePedido(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(
        "Pedido", models.DO_NOTHING, db_column="id_pedido", blank=True, null=True
    )
    id_producto = models.ForeignKey(
        "Producto", models.DO_NOTHING, db_column="id_producto", blank=True, null=True
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

    class Meta:
        managed = True
        db_table = "establecimiento"

    def save(self, *args, **kwargs):
        if (self.direccion or self.cp) and not (self.latitud and self.longitud):
            self.geocodificar()
        super().save(*args, **kwargs)

    def geocodificar(self):
        try:
            gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
            direccion_completa = (
                f"{self.direccion}, {self.numero}, {self.cp}, {self.municipio}, España"
            )
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
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario")
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
        models.DO_NOTHING,
        db_column="id_establecimiento",
        blank=True,
        null=True,
    )
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario")
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
        models.DO_NOTHING,
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
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario")
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    precio_hora = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)

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
        models.DO_NOTHING,
        db_column="id_establecimiento",
        blank=True,
        null=True,
    )
    id_usuario = models.ForeignKey(
        Usuario, models.DO_NOTHING, db_column="id_usuario", blank=True, null=True
    )
    puntuacion = models.IntegerField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    comentario = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "valoracion"
