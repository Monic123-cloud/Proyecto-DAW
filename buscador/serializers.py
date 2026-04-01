from rest_framework import serializers
from .models import Servicio

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        # Listamos los campos que React va a enviar y recibir
        fields = ['id_servicio', 'categoria', 'descripcion', 'precio_hora', 'fecha_creacion', 'lat', 'lng', 'cp']
        # Estos campos no se pueden modificar desde el frontend, los genera Django
        read_only_fields = ['id_servicio', 'fecha_creacion', 'lat', 'lng', 'cp']