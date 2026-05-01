from rest_framework import serializers
from .models import Producto, Servicio, Establecimiento
from .models import Valoracion
from .models import SolicitudAyuda

# 1. El que te estaba dando el error de importación (ServicioSerializer)
class ServicioSerializer(serializers.ModelSerializer):

    latitud = serializers.ReadOnlyField(source='lat')
    longitud = serializers.ReadOnlyField(source='lng')
    id_usuario = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Servicio
        fields = ['id_servicio', 'categoria', 'descripcion', 'precio_hora', 'fecha_creacion', 'latitud', 'longitud', 'cp','id_usuario']
        read_only_fields = ['id_servicio', 'fecha_creacion', 'latitud', 'longitud', 'cp']


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
    
class ValoracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valoracion
        # Solo pedimos lo que el usuario envía desde el front
        fields = ['id_establecimiento', 'id_servicio', 'puntuacion', 'comentario']

class ProductoSerializer(serializers.ModelSerializer):
    comercio_nombre = serializers.CharField(source="id_establecimiento.nombre_comercio", read_only=True)
    comercio_cp = serializers.CharField(source="id_establecimiento.cp", read_only=True)
    comercio_municipio = serializers.CharField(source="id_establecimiento.municipio", read_only=True)
    comercio_direccion = serializers.CharField(source="id_establecimiento.direccion", read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id_producto',
            'id_establecimiento',
            'comercio_nombre',
            'comercio_cp',
            'comercio_municipio',
            'comercio_direccion',
            'tipo_producto',
            'producto',
            'stock',
            'precio',
        ]
        read_only_fields = ['id_producto', 'id_establecimiento', 'comercio_nombre', 'comercio_cp', 'comercio_municipio', 'comercio_direccion']