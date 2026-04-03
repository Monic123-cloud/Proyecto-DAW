from rest_framework import serializers
from .models import Servicio, Establecimiento
from .models import SolicitudAyuda

# 1. El que te estaba dando el error de importación (ServicioSerializer)
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id_servicio', 'categoria', 'descripcion', 'precio_hora', 'fecha_creacion', 'lat', 'lng', 'cp']
        read_only_fields = ['id_servicio', 'fecha_creacion', 'lat', 'lng', 'cp']

# 2. El que necesitamos para las estrellas (EstablecimientoSerializer)
class EstablecimientoSerializer(serializers.ModelSerializer):
    promedio_valoraciones = serializers.SerializerMethodField()
    numero_valoraciones = serializers.SerializerMethodField()
    distancia = serializers.SerializerMethodField()

    class Meta:
        model = Establecimiento
        fields = [
            'id_establecimiento', 'nombre_comercio', 'direccion', 
            'cp', 'latitud', 'longitud', 'promedio_valoraciones', 
            'numero_valoraciones', 'distancia'
        ]

    def get_promedio_valoraciones(self, obj):
        return getattr(obj, 'promedio_valoraciones', 0)

    def get_numero_valoraciones(self, obj):
        return getattr(obj, 'numero_valoraciones', 0)

    def get_distancia(self, obj):
        return getattr(obj, 'distancia', None)