# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
import requests
import googlemaps
from django.db import models
from django.conf import settings


class DetallePedido(models.Model):
<<<<<<< HEAD
    id_detalle = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_detalle = models.AutoField(primary_key=True)
>>>>>>> monica
    id_pedido = models.ForeignKey(
        "Pedido", models.DO_NOTHING, db_column="id_pedido", blank=True, null=True
    )
    id_producto = models.ForeignKey(
        "Producto", models.DO_NOTHING, db_column="id_producto", blank=True, null=True
    )
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(
        max_digits=10, decimal_places=5
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "detalle_pedido"


class Establecimiento(models.Model):
<<<<<<< HEAD
    id_establecimiento = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_establecimiento = models.AutoField(primary_key=True)
>>>>>>> monica
    nombre_comercio = models.CharField()
    categoria = models.CharField(blank=True, null=True)
    telefono = models.CharField(blank=True, null=True)
    correo = models.CharField(blank=True, null=True)
    direccion = models.CharField(blank=True, null=True)
    numero = models.CharField(blank=True, null=True)
    municipio = models.CharField(blank=True, null=True)
    provincia = models.CharField(blank=True, null=True)
    cp = models.CharField(blank=True, null=True)
    latitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    longitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    url_web = models.CharField(blank=True, null=True)

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "establecimiento"

    def save(self, *args, **kwargs):
        # Si tenemos dirección y CP, pero no coordenadas, las buscamos
        if (self.direccion or self.cp) and not (self.latitud and self.longitud):
            self.geocodificar()
        super().save(*args, **kwargs)

    def geocodificar(self):
        gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
        direccion_completa = (
            f"{self.direccion}, {self.numero}, {self.cp}, {self.municipio}, España"
        )

        try:
            # Llamada oficial a la API de geocodificación
            result = gmaps.geocode(direccion_completa)
            print(
                f"Éxito: {self.nombre_comercio} ubicado en {self.latitud}, {self.longitud}"
            )
            if result:
                location = result[0]["geometry"]["location"]
                self.latitud = location["lat"]
                self.longitud = location["lng"]
        except Exception as e:
            print(f"Error con Google Maps API: {e}")


class Evento(models.Model):
<<<<<<< HEAD
    id_evento = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_evento = models.AutoField(primary_key=True)
>>>>>>> monica
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario")
    nombre_evento = models.CharField()
    categoria = models.CharField(blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    lugar = models.CharField(blank=True, null=True)
    publico_objetivo = models.CharField(blank=True, null=True)
    rol_evento = models.CharField(blank=True, null=True)

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "evento"


class Pedido(models.Model):
<<<<<<< HEAD
    id_pedido = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_pedido = models.AutoField(primary_key=True)
>>>>>>> monica
    id_establecimiento = models.ForeignKey(
        Establecimiento,
        models.DO_NOTHING,
        db_column="id_establecimiento",
        blank=True,
        null=True,
    )
<<<<<<< HEAD
    id_usuario = models.ForeignKey(
        "Usuario", models.DO_NOTHING, db_column="id_usuario", blank=True, null=True
    )
=======
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario")
>>>>>>> monica
    importe_total = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    fecha = models.TextField(blank=True, null=True)  # This field type is a guess.
    metodo_pago = models.CharField(blank=True, null=True)
    descuento = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    metodo_entrega = models.CharField(blank=True, null=True)
    estado = models.CharField(blank=True, null=True)

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "pedido"


class Producto(models.Model):
<<<<<<< HEAD
    id_producto = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_producto = models.AutoField(primary_key=True)
>>>>>>> monica
    id_establecimiento = models.ForeignKey(
        Establecimiento,
        models.DO_NOTHING,
        db_column="id_establecimiento",
        blank=True,
        null=True,
    )
    tipo_producto = models.CharField(blank=True, null=True)
    producto = models.CharField()
    stock = models.IntegerField(blank=True, null=True)
    precio = models.DecimalField(
        max_digits=10, decimal_places=5
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "producto"


class Servicio(models.Model):
<<<<<<< HEAD
    id_servicio = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_servicio = models.AutoField(primary_key=True)
>>>>>>> monica
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario")
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(blank=True, null=True)
    precio_hora = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    fecha_creacion = models.TextField(
        blank=True, null=True
    )  # This field type is a guess.

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "servicio"


class Usuario(models.Model):
<<<<<<< HEAD
    id_usuario = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_usuario = models.AutoField(primary_key=True)
>>>>>>> monica
    nombre = models.CharField()
    apellidos = models.CharField()
    correo = models.CharField(unique=True)
    auth_id = models.CharField(unique=True)
    sexo = models.CharField(blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    telefono = models.CharField(blank=True, null=True)
    direccion = models.CharField(blank=True, null=True)
    numero = models.CharField(blank=True, null=True)
    piso = models.CharField(blank=True, null=True)
    letra = models.CharField(blank=True, null=True)
    municipio = models.CharField(blank=True, null=True)
    provincia = models.CharField(blank=True, null=True)
    cp = models.CharField(blank=True, null=True)
    latitud = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    longitud = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True
    )  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "usuario"


class Valoracion(models.Model):
<<<<<<< HEAD
    id_valoracion = models.AutoField(primary_key=True, blank=True, null=True)
=======
    id_valoracion = models.AutoField(primary_key=True)
>>>>>>> monica
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
    fecha = models.TextField(blank=True, null=True)  # This field type is a guess.
    comentario = models.TextField(blank=True, null=True)

    class Meta:
<<<<<<< HEAD
        managed = False
=======
        managed = True
>>>>>>> monica
        db_table = "valoracion"
