""" "Es el controlador que gestiona la lógica de negocio, procesando las peticiones de búsqueda para devolver resultados
de la base de datos local y la API de Google Maps en formato JSON."""

from django.shortcuts import render
from rest_framework.views import APIView  # # Clase base para crear tu endpoint de API
from rest_framework.response import (
    Response,
)  # Se encarga de enviar los datos en formato JSON a React
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)  # Restringe funciones solo a usuarios registrados
from django.db.models import (
    F,
    ExpressionWrapper,
    FloatField,
)  # Para calcular la distancia entre coordenadas en la base de datos
from django.db.models.functions import (
    ACos,
    Cos,
    Radians,
    Sin,
)  # Fórmula Haversina para calcular distancias geográficas
from .models import (
    Establecimiento,
)  # Importa la tabla de establecimiento para hacer consultas a la BBDD
from django.conf import (
    settings,
)  # Para acceder a la clave de la API de Google Maps desde settings
from geopy.geocoders import (
    Nominatim,
)  # API externa de Google Places para geolocalizar direcciones a coordenadas (lat/lng)
import requests  # Para hacer peticiones HTTP a la API de Google Maps
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.forms.models import model_to_dict


# 1. Vista del mapa.html. Lee los datos que vienen en la URL
def buscador_mapa(request):
    """Renderiza la página principal del mapa"""
    user_lat = request.GET.get("lat")
    user_lng = request.GET.get("lng")
    radio_km = request.GET.get("radio", 5)  # Si no viene radio, usa 5km por defecto
    cp_buscado = request.GET.get("cp")

    comercios = Establecimiento.objects.all()
    # Fórmula Haversina para calcular la distancia entre las coordenadas del usuario y las de cada comercio en la base de datos. Si el usuario ha puesto latitud y longitud, ordena por distancia. Si ha puesto un CP, filtra por ese CP. Si no ha puesto nada, muestra todos los comercios sin ordenar ni filtrar.
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
                    output_field=FloatField(),  # resultado del cálculo de distancia va a ser un número decimal
                )
            )
            .filter(
                distancia__lte=float(radio_km)
            )  # Lte:Significa "Less Than or Equal"
            .order_by("distancia")
        )
    elif cp_buscado:
        comercios = comercios.filter(cp=cp_buscado)

    return render(  # a diferencia de Response (que solo envía datos JSON), render envía una página visual completa
        request,
        "mapa.html",  # esta función busca un archivo llamado mapa.html
        {
            "comercios": comercios,
            "mi_id": request.session.get(
                "establecimiento_id"
            ),  # pasa el ID del comercio que pertenece al usuario que está navegando,para permitirte editar solo tu establecimiento
        },
    )


# 2. API de búsqueda (Para React). devuelve datos puros (JSON). Es la que consume React para mostrar los resultados de búsqueda en el mapa. Lee los parámetros de búsqueda (lat/lng o CP) y devuelve una lista de comercios que cumplen esos criterios, tanto de la base de datos local como de Google Maps.
class BuscadorAPIView(APIView):
    permission_classes = [
        AllowAny
    ]  # Permite que cualquiera busque comercios sin loguearse

    def get(
        self, request
    ):  # Lee los parámetros de búsqueda que vienen en la URL (latitud, longitud, radio en km y código postal)
        user_lat = request.query_params.get("lat")
        user_lng = request.query_params.get("lng")
        radio_km = float(request.query_params.get("radio", 5))
        cp_buscado = request.query_params.get("cp")

        # 1: Busca en BBDD Locales
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
                "cif_nif",
                "latitud",
                "longitud",
                "direccion",
                "cp",
            )
        )

        # 2: Busca en EN GOOGLE MAPS
        # Solo llamamos a Google si el usuario ha puesto un CP o coordenadas
        api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", "")

        # Caso A: Si el usuario pulsa el botón de UBICACIÓN (lat/lng)
        if user_lat and user_lng and api_key:
            # Usamos Nearby Search para buscar sitios alrededor de las coordenadas
            google_url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={user_lat},{user_lng}&radius={radio_km * 1000}&type=store&region=es&key={api_key}"
            try:
                response = requests.get(
                    google_url
                )  # llama a los servidores de Google Maps
                google_results = response.json().get(
                    "results", []
                )  # Extrae la lista de resultados del JSON que devuelve Google Maps. Si no hay resultados, devuelve una lista vacía para evitar errores
                for place in google_results:
                    data_final.append(  # Traduce la respuesta de Google Maps a nuestro formato,para que React pueda mostrar todo junto sin importar el origen
                        {
                            "id_establecimiento": place.get("place_id"),
                            "nombre_comercio": place.get("name"),
                            "latitud": place["geometry"]["location"]["lat"],
                            "longitud": place["geometry"]["location"]["lng"],
                            "direccion": place.get("vicinity"),
                            "cp": "Cerca de ti",
                        }
                    )
            except Exception as e:
                print(f"Error en Google Nearby: {e}")

        # Caso B: Si el usuario escribe un CP
        elif cp_buscado and api_key:
            google_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=comercios+en+CP+{cp_buscado}+Spain&region=es&type=store&key={api_key}"
            try:
                response = requests.get(google_url)
                google_results = response.json().get("results", [])
                for place in google_results:
                    data_final.append(
                        {
                            "id_establecimiento": place.get("place_id"),
                            "nombre_comercio": place.get("name"),
                            "latitud": place["geometry"]["location"]["lat"],
                            "longitud": place["geometry"]["location"]["lng"],
                            "direccion": place.get("formatted_address"),
                            "cp": cp_buscado,
                        }
                    )
            except Exception as e:
                print(f"Error en Google TextSearch: {e}")

        return Response(data_final)


# 3. Geolocalizador. convertir una dirección de texto en coordenadas geográficas.
class GeolocalizadorAPIView(APIView):
    permission_classes = [AllowAny]

    def post(
        self, request
    ):  # se usa POST para enviar datos que el cliente (React) envía en el cuerpo de una petición (request.data)
        direccion = request.data.get("direccion")
        geolocator = Nominatim(
            user_agent="mi_buscador_daw"
        )  # Traduce las direcciones de OpenStreetMap
        try:
            location = geolocator.geocode(
                direccion
            )  # Llama a los servidores de OpenStreetMap para convertir la dirección en coordenadas. Si la dirección no se encuentra, devuelve None
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


# 4. PROXY de GOOGLE MAPS por seguridad y CORS, por tanto Django es el intermediario entre REACT y GOOGLE MAPS
class GoogleMapsProxyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        location = request.query_params.get("location")
        radius = request.query_params.get("radius", "1500")
        api_key = getattr(
            settings, "GOOGLE_MAPS_API_KEY", ""
        )  # lee la clave secreta desde el archivo settings.py

        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&key={api_key}"
        response = requests.get(url)
        return Response(response.json())


# Formulario de establecimiento
@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([AllowAny])
def gestionar_formulario(request, pk=None):

    if pk:
        try:
            establecimiento = Establecimiento.objects.get(pk=pk)
        except Establecimiento.DoesNotExist:
            return Response(
                {"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "PUT":
            # Actualizamos solo los campos que vengan en el JSON
            for campo, valor in request.data.items():
                setattr(establecimiento, campo, valor)
            establecimiento.save()
            return Response({"mensaje": "Actualizado correctamente"})

        elif request.method == "DELETE":
            establecimiento.delete()
            return Response(
                {"mensaje": "Eliminado", "id": pk}, status=status.HTTP_200_OK
            )

    if request.method == "GET":
        # Aquí los datos de prueba o de la DB
        data = {"mensaje": "Listo para recibir el formulario"}
        return Response(data)

    elif request.method == "POST":
        # DRF ya procesa el JSON automáticamente en request.data
        datos = request.data

        tipo_raw = datos.get("tipo_negocio", "comercio")
        mapeo_tipos = {
            "Comercio": "comercio",
            "Productor Local": "productor",
            "comercio": "comercio",
            "productor": "productor",
        }
        tipo_final = mapeo_tipos.get(tipo_raw, "comercio")

        try:
            # 2. Creamos el registro en PostgreSQL
            nuevo_establecimiento = Establecimiento.objects.create(
                nombre_comercio=datos.get("nombre_comercio"),
                cif_nif=datos.get("cif_nif"),
                tipo_negocio=tipo_final,
                grupo=datos.get("grupo"),
                categoria=datos.get("categoria"),
                subcategoria=datos.get("subcategoria"),  # Guarda el detalle
                telefono=datos.get("telefono"),
                correo=datos.get("correo"),
                direccion=datos.get("direccion"),
                numero=datos.get("numero"),
                municipio=datos.get("municipio"),
                provincia=datos.get("provincia"),
                cp=datos.get("cp"),
                latitud=datos.get("latitud", 0),
                longitud=datos.get("longitud", 0),
            )

            return Response(
                {
                    "status": "Éxito",
                    "id": nuevo_establecimiento.id_establecimiento,
                    "mensaje": "Establecimiento creado correctamente",
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            # Si algo falla (ej: falta un campo), nos avisa
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def buscar_cif(request, cif):
    try:
        # Buscamos el establecimiento por el campo cif_nif
        cif_limpio = cif.strip().upper()
        establecimiento = Establecimiento.objects.get(cif_nif=cif.upper())

        return Response(model_to_dict(establecimiento), status=status.HTTP_200_OK)
    except Establecimiento.DoesNotExist:
        return Response(
            {"error": "No se encontró ningún negocio con ese CIF/DNI"},
            status=status.HTTP_404_NOT_FOUND,
        )
