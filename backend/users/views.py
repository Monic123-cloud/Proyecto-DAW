from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from django.contrib.auth import authenticate, get_user_model
from knox.models import AuthToken

from .serializers import RegisterSerializer, LoginSerializer, UserSafeSerializer

User = get_user_model()

# Si Establecimiento no está en productos
try:
    from productos.models import Establecimiento
except Exception:
    Establecimiento = None


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_id = getattr(user, "id_usuario", user.pk)
            return Response(
                {"message": "Usuario creado correctamente", "user_id": user_id},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            return Response(
                {"error": "Credenciales incorrectas"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        _, token = AuthToken.objects.create(user)

        user_id = getattr(user, "id_usuario", user.pk)

        # comercio si existe un establecimiento con usuario_id = user_id
        role = "cliente"
        if Establecimiento is not None:
            is_comercio = Establecimiento.objects.filter(usuario_id=user_id).exists()
            role = "comercio" if is_comercio else "cliente"

        return Response(
            {
                "token": token,
                "role": role,
                "user": UserSafeSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )