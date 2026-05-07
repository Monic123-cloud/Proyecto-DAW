from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser

from rest_framework.validators import UniqueValidator

User = get_user_model()



class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=CustomUser.objects.all(),
                message="Este email ya está registrado."
            )
        ]
    )

  
    dias_disponibles = serializers.CharField(
        write_only=True,
        required=False
    )

    horario_inicio = serializers.TimeField(
        write_only=True,
        required=False
    )

    horario_fin = serializers.TimeField(
        write_only=True,
        required=False
    )

    cp = serializers.CharField(
        write_only=True,
        required=False
    )

    def validate(self, data):

        voluntariado = data.get('voluntariado', False)

        if voluntariado:

            errores = {}

            campos = [
                'dias_disponibles',
                'horario_inicio',
                'horario_fin',
                'cp'
            ]

            for campo in campos:
                if not data.get(campo):
                    errores[campo] = (
                        'Este campo es obligatorio para voluntarios.'
                    )

            if errores:
                raise serializers.ValidationError(errores)

        return data

    class Meta:
        model = CustomUser 
        fields = ('email', 'password', 'dias_disponibles', 'horario_inicio', 'horario_fin', 'cp')

    def create(self, validated_data):
       
        voluntariado = validated_data.get('voluntariado', False)

        dias = validated_data.pop('dias_disponibles', None)
        h_inicio = validated_data.pop('horario_inicio', None)
        h_fin = validated_data.pop('horario_fin', None)
        codigo_p = validated_data.pop('cp', None)

        
        user = CustomUser.objects.create_user(**validated_data)
        if voluntariado:
        # registro de Voluntario 
            from buscador.models import Voluntario 
            Voluntario.objects.create(
                usuario=user,
                cp=codigo_p,
                dias_disponibles=dias,
                horario_inicio=h_inicio,
                horario_fin=h_fin,
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