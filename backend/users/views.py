from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from django.contrib.auth import authenticate, get_user_model
from knox.models import AuthToken

from .serializers import RegisterSerializer, LoginSerializer, UserSafeSerializer

User = get_user_model()

# Establecimiento puede estar en productos (según tu proyecto)
try:
    from productos.models import Establecimiento
except Exception:
    Establecimiento = None


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        """
        POST /register/
        Body debe incluir role: 'cliente' o 'comercio'
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_id = getattr(user, "id_usuario", user.pk)
            return Response(
                {"ok": True, "message": "Usuario creado correctamente", "user_id": user_id},
                status=status.HTTP_201_CREATED,
            )
        return Response({"ok": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="cliente")
    def cliente(self, request):
        """
        POST /register/cliente/
        Registra cliente (sin cif_nif)
        """
        data = dict(request.data)
        data["role"] = "cliente"
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user_id = getattr(user, "id_usuario", user.pk)
            return Response(
                {"ok": True, "message": "Cliente creado correctamente", "user_id": user_id},
                status=status.HTTP_201_CREATED,
            )
        return Response({"ok": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="comercio")
    def comercio(self, request):
        """
        POST /register/comercio/
        Registra comercio (requiere cif_nif)
        """
        data = dict(request.data)
        data["role"] = "comercio"
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user_id = getattr(user, "id_usuario", user.pk)
            return Response(
                {"ok": True, "message": "Comercio creado correctamente", "user_id": user_id},
                status=status.HTTP_201_CREATED,
            )
        return Response({"ok": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"ok": False, "error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

        _, token = AuthToken.objects.create(user)
        user_id = getattr(user, "id_usuario", user.pk)

        role = "cliente"
        if Establecimiento is not None:
            role = "comercio" if Establecimiento.objects.filter(usuario_id=user_id).exists() else "cliente"

        return Response(
            {
                "ok": True,
                "token": token,
                "role": role,
                "user": UserSafeSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )