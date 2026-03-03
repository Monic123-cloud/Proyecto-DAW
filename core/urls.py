from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Panel de Administración de Django
    path("admin/", admin.site.urls),
    # Rutas para el cableado JWT (Flecha en el dibujo)
    # Login: Envías user/pass y recibes el Access Token
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Refresh: Para renovar el token sin volver a loguearte
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Rutas de la app
    # Incluimos las rutas de la carpeta 'buscador'
    path("api/buscador/", include("buscador.urls")),
]
