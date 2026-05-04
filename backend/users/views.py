from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions,mixins
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model, authenticate
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class RegisterView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
       
        user = serializer.save()

       
        user.set_password(user.password)
        user.save()

        self.user = user


    def create(self, request, *args, **kwargs):
       

        response = super().create(request, *args, **kwargs)

        return Response({
            "mensaje": "Usuario creado correctamente",
            "user_id": self.user.id
        }, status=status.HTTP_201_CREATED)


class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request): 
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            if not user:
                return Response({"error": "Credenciales inválidas"}, status=401)

            refresh = RefreshToken.for_user(user)

             
            if user.is_superuser:
                tipo = "superuser"
            else:
                tipo = "usuario"

            #tipo en JWT
            refresh["tipo"] = tipo

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                })   
        else: 
            return Response(serializer.errors,status=400)
