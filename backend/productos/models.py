from django.db import models


class Establecimiento(models.Model):
    id_establecimiento = models.IntegerField(primary_key=True)
    nombre_comercio = models.CharField(max_length=255)
    cif_nif = models.CharField(max_length=50, blank=True, null=True)
    tipo_negocio = models.CharField(max_length=100, blank=True, null=True)
    grupo = models.CharField(max_length=100, blank=True, null=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    subcategoria = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=50, blank=True, null=True)
    correo = models.CharField(max_length=255, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=50, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    cp = models.CharField(max_length=20, blank=True, null=True)
    latitud = models.FloatField(blank=True, null=True)
    longitud = models.FloatField(blank=True, null=True)
    url_web = models.CharField(max_length=255, blank=True, null=True)
    usuario_id = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "establecimiento"
        managed = False


class Producto(models.Model):
    id_producto = models.IntegerField(primary_key=True)
    tipo_producto = models.CharField(max_length=100)
    producto = models.CharField(max_length=255)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    id_establecimiento = models.IntegerField()

    class Meta:
        db_table = "producto"
        managed = False


class Pedido(models.Model):
    id_pedido = models.IntegerField(primary_key=True)  # <-- manual
    importe_total = models.FloatField()
    fecha = models.DateTimeField()
    metodo_pago = models.CharField(max_length=50)
    descuento = models.FloatField()
    metodo_entrega = models.CharField(max_length=50)
    estado = models.CharField(max_length=50)
    id_establecimiento = models.IntegerField()
    id_usuario = models.IntegerField()

    class Meta:
        managed = False
        db_table = "pedido"


class DetallePedido(models.Model):
    id_detalle = models.IntegerField(primary_key=True)  # <-- manual
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    id_pedido = models.IntegerField()
    id_producto = models.IntegerField()

    class Meta:
        managed = False
        db_table = "detalle_pedido"