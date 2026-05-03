from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    BuscadorAPIView,
    GeolocalizadorAPIView,
    GoogleMapsProxyView,
    ProductoViewSet,
    buscador_mapa,
    gestionar_formulario,
    buscar_cif,
    ver_mi_local,
    ServicioViewSet,
    lista_solicitudes_ayuda,
    buscar_y_login_por_cif,
    ValoracionViewSet,
    crear_solicitud_ayuda,
)

# Definimos el router
router = DefaultRouter()
# Registramos el ViewSet de servicios
router.register(r"servicios", ServicioViewSet, basename="servicio")
# Registramos el ViewSet de valoraciones
router.register(r"valoraciones", ValoracionViewSet, basename="valoracion")
# Registramos productos para tienda online
router.register(r"productos", ProductoViewSet, basename="producto")

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
    # path("buscar-cif/<str:cif>/", buscar_cif, name="buscar_cif"),
    path("buscar-cif/<str:cif>/", buscar_y_login_por_cif, name="buscar_y_login"),
    path("", include(router.urls)),
    path("solicitudes-ayuda/", lista_solicitudes_ayuda, name="solicitudes_ayuda_list"),
    path("solicitar-ayuda/", crear_solicitud_ayuda, name="crear_solicitud_ayuda"),
    path("experto-mercado/", views.analizar_mercado, name="analizar_mercado"),
    path(
        "checkout/descontar-stock/",
        views.descontar_stock_productos,
        name="descontar_stock_productos",
    ),
]
