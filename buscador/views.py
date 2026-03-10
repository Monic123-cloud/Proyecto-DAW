from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import F, ExpressionWrapper, FloatField
from django.db.models.functions import ACos, Cos, Radians, Sin
from .models import Establecimiento
from geopy.geocoders import Nominatim
import requests
from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated


# 1. VISTA DEL MAPA (HTML Tradicional)
def buscador_mapa(request):
    """Renderiza la página principal del mapa"""
    user_lat = request.GET.get("lat")
    user_lng = request.GET.get("lng")
    radio_km = request.GET.get("radio", 5)
    cp_buscado = request.GET.get("cp")

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
            .filter(distancia__lte=float(radio_km))
            .order_by("distancia")
        )
    elif cp_buscado:
        comercios = comercios.filter(cp=cp_buscado)

    return render(
        request,
        "mapa.html",
        {
            "comercios": comercios,
            "mi_id": request.session.get("establecimiento_id"),
        },
    )


# 2. API DE BÚSQUEDA (Para React / Next.js) - ACTUALIZADA
class BuscadorAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_lat = request.query_params.get("lat")
        user_lng = request.query_params.get("lng")
        radio_km = float(request.query_params.get("radio", 5))
        cp_buscado = request.query_params.get("cp")

        # --- PARTE 1: BUSCAR EN BASE DE DATOS LOCAL ---
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

        # Preparamos los datos locales
        data_final = list(
            comercios.values(
                "id_establecimiento",
                "nombre_comercio",
                "latitud",
                "longitud",
                "direccion",
                "cp",
            )
        )

        # --- PARTE 2: BUSCAR EN GOOGLE MAPS SI HAY CP ---
        # Solo llamamos a Google si el usuario ha puesto un CP o coordenadas
        api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", "")

        if cp_buscado and api_key:
            # Buscamos comercios en ese código postal usando Google Places
            google_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=comercios+en+codigo+postal+{cp_buscado}&key={api_key}"
            try:
                response = requests.get(google_url)
                print(f"Status de Google: {json_data.get('status')}")
                google_results = response.json().get("results", [])

                for place in google_results:
                    data_final.append(
                        {
                            "id_establecimiento": place.get(
                                "place_id"
                            ),  # Usamos el ID de Google
                            "nombre_comercio": place.get("name"),
                            "latitud": place["geometry"]["location"]["lat"],
                            "longitud": place["geometry"]["location"]["lng"],
                            "direccion": place.get("formatted_address"),
                            "cp": cp_buscado,
                        }
                    )
            except Exception as e:
                print(f"Error llamando a Google: {e}")

        return Response(data_final)


# 3. GEOLOCALIZADOR
class GeolocalizadorAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        direccion = request.data.get("direccion")
        geolocator = Nominatim(user_agent="mi_buscador_daw")
        try:
            location = geolocator.geocode(direccion)
            if location:
                return Response(
                    {
                        "lat": location.latitude,
                        "lng": location.longitude,
                        "address": location.address,
                    }
                )
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        return Response({"status": "No se encontró la dirección"}, status=404)


# 4. PROXY DE GOOGLE MAPS
class GoogleMapsProxyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        location = request.query_params.get("location")
        radius = request.query_params.get("radius", "1500")
        api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", "")

        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&key={api_key}"
        response = requests.get(url)
        return Response(response.json())
