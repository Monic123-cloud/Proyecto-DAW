from django.shortcuts import render
<<<<<<< HEAD
from .models import Establecimiento
from django.db.models import F, ExpressionWrapper, FloatField
from django.db.models.functions import ACos, Cos, Radians, Sin


def buscador_mapa(request):
    # Recibimos coordenadas del usuario
    user_lat = request.GET.get("lat")
    user_lng = request.GET.get("lng")
    radio_km = request.GET.get("radio", 5)  # 5km por defecto
    cp_buscado = request.GET.get("cp")

    comercios = Establecimiento.objects.all()

    # Si el navegador nos envió la ubicación del usuario:
    if user_lat and user_lng:
        lat1 = Radians(float(user_lat))
        lng1 = Radians(float(user_lng))

        comercios = (
            comercios.annotate(
                distancia=ExpressionWrapper(
                    6371
                    * ACos(
                        Cos(lat1)
                        * Cos(Radians(F("latitud")))
                        * Cos(Radians(F("longitud")) - lng1)
                        + Sin(lat1) * Sin(Radians(F("latitud")))
                    ),
                    output_field=FloatField(),
                )
            )
            .filter(distancia__lte=float(radio_km))
            .order_by("distancia")
        )

    elif cp_buscado:
        comercios = comercios.filter(cp=cp_buscado)

=======
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import F, ExpressionWrapper, FloatField
from django.db.models.functions import ACos, Cos, Radians, Sin
from .models import Establecimiento
from geopy.geocoders import Nominatim
import requests
from django.conf import settings


# 1. VISTA DEL MAPA (HTML)
def buscador_mapa(request):
    """Renderiza la página principal del mapa"""
>>>>>>> monica
    return render(
        request,
        "mapa.html",
        {
<<<<<<< HEAD
            "comercios": comercios,
            "mi_id": request.session.get("establecimiento_id"),
        },
    )
=======
            "mi_id": request.session.get("establecimiento_id"),
        },
    )


# 2. API DE BÚSQUEDA PROPIA (Tu lógica de distancias)
class BuscadorAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_lat = request.query_params.get("lat")
        user_lng = request.query_params.get("lng")
        radio_km = float(request.query_params.get("radio", 5))
        cp_buscado = request.query_params.get("cp")

        comercios = Establecimiento.objects.all()

        if user_lat and user_lng:
            lat1 = Radians(float(user_lat))
            lng1 = Radians(float(user_lng))
            comercios = (
                comercios.annotate(
                    distancia=ExpressionWrapper(
                        6371
                        * ACos(
                            Cos(lat1)
                            * Cos(Radians(F("latitud")))
                            * Cos(Radians(F("longitud")) - lng1)
                            + Sin(lat1) * Sin(Radians(F("latitud")))
                        ),
                        output_field=FloatField(),
                    )
                )
                .filter(distancia__lte=radio_km)
                .order_by("distancia")
            )
        elif cp_buscado:
            comercios = comercios.filter(cp=cp_buscado)

        # Devolvemos los campos necesarios para pintar los pines en el mapa
        data = list(
            comercios.values("id", "nombre", "latitud", "longitud", "direccion", "cp")
        )
        return Response(data)


# 3. GEOLOCALIZADOR (Convertir dirección en coordenadas)
class GeolocalizadorAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        direccion = request.data.get("direccion")
        geolocator = Nominatim(user_agent="mi_buscador_daw")
        location = geolocator.geocode(direccion)
        if location:
            return Response(
                {
                    "lat": location.latitude,
                    "lng": location.longitude,
                    "address": location.address,
                }
            )
        # Aquí llamaríamos a Google Geocoding API si fuera necesario
        # Por ahora, devolvemos un log de confirmación
        return Response(
            {"status": "Recibida dirección para geolocalizar", "direccion": direccion}
        )


# 4. PROXY DE GOOGLE MAPS (Para no exponer API KEY en el JS)
class GoogleMapsProxyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ejemplo: Buscar lugares cercanos usando la API de Google
        location = request.query_params.get("location")  # ej: "41.6483,-0.8891"
        radius = request.query_params.get("radius", "1500")

        api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", "TU_API_KEY_AQUI")
        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&key={api_key}"

        response = requests.get(url)
        return Response(response.json())
>>>>>>> monica
