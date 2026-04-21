from rest_framework import serializers
from .models import Producto

class ProductoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id_producto", "tipo_producto", "producto", "stock", "precio", "id_establecimiento"]
        read_only_fields = ["id_producto"]