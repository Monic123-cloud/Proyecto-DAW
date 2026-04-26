from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Registro válido para CLIENTE y COMERCIO.
    - Cliente: NO requiere cif_nif
    - Comercio: SÍ requiere cif_nif
    """

    role = serializers.ChoiceField(choices=["cliente", "comercio"], default="cliente", write_only=True)

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "username",
            "role",
            # datos personales
            "nombre",
            "apellidos",
            "sexo",
            "fecha_nacimiento",
            "telefono",
            # dirección
            "direccion",
            "numero",
            "piso",
            "letra",
            "municipio",
            "provincia",
            "cp",
            # geo
            "latitud",
            "longitud",
            # opcional
            "voluntariado",
            # campo comercio (lo hacemos opcional en serializer)
            "cif_nif",
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"required": False, "allow_blank": True},
            "cif_nif": {"required": False, "allow_blank": True, "allow_null": True},
            "fecha_nacimiento": {"required": False, "allow_null": True},
            "telefono": {"required": False, "allow_blank": True, "allow_null": True},
            "direccion": {"required": False, "allow_blank": True, "allow_null": True},
            "numero": {"required": False, "allow_blank": True, "allow_null": True},
            "piso": {"required": False, "allow_blank": True, "allow_null": True},
            "letra": {"required": False, "allow_blank": True, "allow_null": True},
            "municipio": {"required": False, "allow_blank": True, "allow_null": True},
            "provincia": {"required": False, "allow_blank": True, "allow_null": True},
            "cp": {"required": False, "allow_blank": True, "allow_null": True},
            "latitud": {"required": False, "allow_null": True},
            "longitud": {"required": False, "allow_null": True},
            "voluntariado": {"required": False},
            "sexo": {"required": False, "allow_blank": True, "allow_null": True},
            "nombre": {"required": False, "allow_blank": True, "allow_null": True},
            "apellidos": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def validate(self, attrs):
        role = attrs.get("role", "cliente")
        cif = (attrs.get("cif_nif") or "").strip()

        if role == "comercio" and not cif:
            raise serializers.ValidationError({"cif_nif": "cif_nif es obligatorio para comercios."})

        return attrs

    def create(self, validated_data):
        role = validated_data.pop("role", "cliente")
        password = validated_data.pop("password")

        # username opcional: si no viene, lo ponemos con el email (o lo que uses en tu manager)
        if not validated_data.get("username"):
            validated_data["username"] = validated_data.get("email", "")

        user = User(**validated_data)
        user.set_password(password)

        # Si tienes un campo tipo/rol en tu CustomUser, aquí lo setearías.
        # Ejemplo:
        # if hasattr(user, "rol"):
        #     user.rol = role

        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSafeSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "username")

    def get_id(self, obj):
        return getattr(obj, "id_usuario", obj.pk)