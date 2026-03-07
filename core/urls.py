<<<<<<< HEAD
"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
=======
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
>>>>>>> monica
]
