from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # create_user debe existir en tu CustomUserManager
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSafeSerializer(serializers.ModelSerializer):
    """
    Devuelve info segura del usuario (sin password).
    Maneja id_usuario si existe, y si no, usa pk.
    """
    id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "username")

    def get_id(self, obj):
        return getattr(obj, "id_usuario", obj.pk)