from rest_framework import serializers
from django.contrib.auth import get_user_model
from buscador.models import Voluntario

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    
    dias_disponibles = serializers.CharField(required=False, allow_blank=True)
    horario_inicio = serializers.TimeField(required=False,allow_null=True)
    horario_fin = serializers.TimeField(required=False,allow_null=True)

    class Meta:
        model = User
        fields = [
            
            "email", "password",
            "nombre", "apellidos", "sexo",
            "fecha_nacimiento",
            "telefono",
            "direccion", "numero", "piso", "letra",
            "municipio", "provincia", "cp",
            "latitud", "longitud",
            "voluntariado",

            # voluntario
            "dias_disponibles",
            "horario_inicio",
            "horario_fin",
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

        def create(self, validated_data):
            voluntariado = validated_data.get("voluntariado", False)

            dias = validated_data.pop("dias_disponibles", None)
            inicio = validated_data.pop("horario_inicio", None)
            fin = validated_data.pop("horario_fin", None)

            
            password = validated_data.pop("password")
    
            user = User.objects.create_user(password=password, **validated_data)

            


    
            if voluntariado:
                Voluntario.objects.create(
                    usuario=user,
                    dias_disponibles=dias,
                    horario_inicio=inicio,
                    horario_fin=fin,
                    activo=True
                )

            return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret