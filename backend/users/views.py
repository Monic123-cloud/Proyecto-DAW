from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from django.contrib.auth import authenticate, get_user_model
from knox.models import AuthToken

# 👇 importa tu modelo Establecimiento (ajusta el import si tu app se llama distinto)
from productos.models import Establecimiento  # <- si está en backend/productos/models.py

from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()

class RegisterViewset(viewsets.ViewSet):
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Usuario creado correctamente",
                "user_id": user.id_usuario
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        # ✅ crea token
        _, token = AuthToken.objects.create(user)

        # ✅ decide si es comercio (tiene establecimiento asociado) o cliente
        est = (
            Establecimiento.objects
            .filter(usuario_id=getattr(user, "id_usuario", user.id))
            .values("id_establecimiento", "nombre_comercio")
            .first()
        )

        role = "comercio" if est else "cliente"

        return Response(
            {
                "user": self.serializer_class(user).data,
                "token": token,
                "role": role,
                "establecimiento": est,  # {id_establecimiento, nombre_comercio} o null
            },
            status=status.HTTP_200_OK
        )