from django.urls import path
from .views import (
    BuscadorAPIView,
    GeolocalizadorAPIView,
    GoogleMapsProxyView,
    buscador_mapa,
    gestionar_formulario,
    buscar_cif,
    ver_mi_local,
)

urlpatterns = [
    # El mapa visual (HTML)
    path("mapa/", buscador_mapa, name="buscador_mapa"),
    # Las rutas de la API
    path("buscar/", BuscadorAPIView.as_view(), name="buscador_propio"),
    path("geolocalizar/", GeolocalizadorAPIView.as_view(), name="geolocalizador"),
    path("google-maps/", GoogleMapsProxyView.as_view(), name="google_maps_proxy"),
    path("establecimiento/mi_local/", ver_mi_local, name="ver_mi_local"),
    path("formulario/", gestionar_formulario, name="formulario_api"),
    path(
        "formulario/<int:pk>/", gestionar_formulario, name="formulario_detalle"
    ),  # Para manejar GET, PUT, DELETE con el ID
    path("buscar-cif/<str:cif>/", buscar_cif, name="buscar_cif"),
]
