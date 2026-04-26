from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BuscadorAPIView,
    GeolocalizadorAPIView,
    GoogleMapsProxyView,
    buscar_cif,
    ver_mi_local,
    ServicioViewSet,
    ValoracionViewSet,
    lista_solicitudes_ayuda,
)

router = DefaultRouter()
router.register(r"servicios", ServicioViewSet, basename="servicio")
router.register(r"valoraciones", ValoracionViewSet, basename="valoracion")

urlpatterns = [
    # API buscador
    path("buscar/", BuscadorAPIView.as_view(), name="buscador_propio"),
    path("geolocalizar/", GeolocalizadorAPIView.as_view(), name="geolocalizador"),
    path("google-maps/", GoogleMapsProxyView.as_view(), name="google_maps_proxy"),

    # CIF / establecimiento
    path("buscar-cif/<str:cif>/", buscar_cif, name="buscar_cif"),
    path("establecimiento/mi_local/", ver_mi_local, name="ver_mi_local"),

    # Voluntariado / solicitudes
    path("solicitudes-ayuda/", lista_solicitudes_ayuda, name="solicitudes_ayuda_list"),

    # ViewSets
    path("", include(router.urls)),
]