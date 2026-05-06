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

  
    dias_disponibles = serializers.CharField(write_only=True)
    horario_inicio = serializers.TimeField(write_only=True)
    horario_fin = serializers.TimeField(write_only=True)
    cp = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ('email', 'password', 'dias_disponibles', 'horario_inicio', 'horario_fin', 'cp')

    def create(self, validated_data):
       
        dias = validated_data.pop('dias_disponibles')
        h_inicio = validated_data.pop('horario_inicio')
        h_fin = validated_data.pop('horario_fin')
        codigo_p = validated_data.pop('cp')

        
        user = CustomUser.objects.create_user(**validated_data)

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