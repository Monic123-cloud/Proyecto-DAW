from django.urls import path
from .views import (
    BuscadorAPIView,
    GeolocalizadorAPIView,
    GoogleMapsProxyView,
    buscador_mapa,
    gestionar_formulario,
)

urlpatterns = [
    # El mapa visual (HTML)
    path("mapa/", buscador_mapa, name="buscador_mapa"),
    # Las rutas de la API que querías poner
    path("buscar/", BuscadorAPIView.as_view(), name="buscador_propio"),
    path("geolocalizar/", GeolocalizadorAPIView.as_view(), name="geolocalizador"),
    path("google-maps/", GoogleMapsProxyView.as_view(), name="google_maps_proxy"),
    path("api/formulario/", gestionar_formulario, name="formulario_api"),
]
