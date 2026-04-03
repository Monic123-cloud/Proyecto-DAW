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
from django.contrib.auth.models import User  # Para gestionar usuarios y autenticación
from rest_framework_simplejwt.tokens import RefreshToken  # Para generar tokens JWT
from .serializers import (
    ServicioSerializer,
    EstablecimientoSerializer,
)  # Para convertir los datos de la base de datos a formato JSON que React entiende
from .models import (
    Servicio,
    Usuario,
)  # Importamos el modelo de Servicio y Usuario para gestionar
from django.http import JsonResponse
from core.analytics_service import get_google_analytics_data
from django.db import models
from django.contrib.auth.models import User
from .models import SolicitudAyuda
from .models import Pedido, Establecimiento


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
        serializer = EstablecimientoSerializer(comercios, many=True)
        data_final = serializer.data

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
                            "promedio_valoraciones": place.get(
                                "rating", 0
                            ),  # Google también da rating
                            "numero_valoraciones": place.get("user_ratings_total", 0),
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
    # 1. Bloqueo de seguridad para edición/borrado
    if request.method in ["PUT", "DELETE"]:
        if not request.user.is_authenticated:
            return Response({"error": "Sesión inválida"}, status=401)

    # Lógica con PK (ID específico para GET, PUT, DELETE)
    if pk:
        try:
            establecimiento = Establecimiento.objects.get(pk=pk)

            if request.method == "GET":
                return Response(model_to_dict(establecimiento))

            elif request.method == "PUT":
                datos = request.data
                campos_prohibidos = [
                    "usuario",
                    "password",
                    "access",
                    "id_establecimiento",
                    "id",
                ]

                for campo, valor in datos.items():
                    if (
                        hasattr(establecimiento, campo)
                        and campo not in campos_prohibidos
                    ):
                        setattr(establecimiento, campo, valor)

                nuevo_email = datos.get("correo")
                if nuevo_email and establecimiento.usuario:
                    establecimiento.usuario.email = nuevo_email
                    establecimiento.usuario.username = nuevo_email
                    establecimiento.usuario.save()

                establecimiento.save()
                return Response(
                    {
                        "mensaje": "Actualizado correctamente",
                        "id": establecimiento.id_establecimiento,
                    }
                )

            elif request.method == "DELETE":
                try:
                    usuario_a_borrar = establecimiento.usuario

                    # 1. Borramos el local
                    establecimiento.delete()

                    # 2. Borramos el usuario asociado para que no queden datos huérfanos
                    if usuario_a_borrar:
                        usuario_a_borrar.delete()

                    return Response({"mensaje": "Eliminado correctamente"}, status=200)

                except Exception as e:
                    print(f"ERROR INTERNO AL BORRAR: {e}")
                    return Response(
                        {"error": f"Error de base de datos: {str(e)}"}, status=500
                    )

        except Establecimiento.DoesNotExist:
            return Response({"error": "Establecimiento no encontrado"}, status=404)
        except Exception as e:
            return Response({"error": f"Error inesperado: {str(e)}"}, status=500)

    # GET general (sin ID)
    if request.method == "GET":
        return Response({"mensaje": "Listo para recibir el formulario"})

    # POST (Registro de nuevo usuario + local)
    elif request.method == "POST":
        datos = request.data
        email = datos.get("correo")
        password = datos.get("password")
        cif_nif = datos.get("cif_nif")

        # Validaciones críticas
        if not cif_nif or not email or not password:
            return Response(
                {"error": "CIF, Email y Password son obligatorios"}, status=400
            )

        if Establecimiento.objects.filter(cif_nif__iexact=cif_nif).exists():
            return Response({"error": "Este CIF/NIF ya está registrado"}, status=400)

        if User.objects.filter(username=email).exists():
            return Response({"error": "Este email ya está registrado"}, status=400)

        try:
            from django.db import transaction

            with transaction.atomic():
                # A. Crear Usuario
                nuevo_usuario = User.objects.create_user(
                    username=email, email=email, password=password
                )

                # B. Mapeo de tipos
                mapeo_tipos = {
                    "Comercio": "comercio",
                    "Productor Local": "productor",
                    "comercio": "comercio",
                    "productor": "productor",
                }
                tipo_final = mapeo_tipos.get(datos.get("tipo_negocio"), "comercio")

                # C. Crear Establecimiento (DENTRO del bloque atomic)
                nuevo_establecimiento = Establecimiento.objects.create(
                    usuario=nuevo_usuario,
                    nombre_comercio=datos.get("nombre_comercio"),
                    cif_nif=cif_nif,
                    tipo_negocio=tipo_final,
                    grupo=datos.get("grupo"),
                    categoria=datos.get("categoria"),
                    subcategoria=datos.get("subcategoria"),
                    telefono=datos.get("telefono"),
                    correo=email,
                    direccion=datos.get("direccion"),
                    numero=datos.get("numero"),
                    municipio=datos.get("municipio"),
                    provincia=datos.get("provincia"),
                    cp=datos.get("cp"),
                    latitud=datos.get("latitud", 0),
                    longitud=datos.get("longitud", 0),
                )

                # El return debe estar fuera del 'with' pero dentro del 'try'
                return Response(
                    {
                        "status": "Éxito",
                        "id": nuevo_establecimiento.id_establecimiento,
                        "mensaje": "Establecimiento creado correctamente",
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def buscar_cif(request, cif):
    try:
        cif_limpio = cif.strip().upper()
        # Buscamos el objeto
        establecimiento = Establecimiento.objects.filter(
            cif_nif__iexact=cif_limpio
        ).first()

        # Si no existe el negocio en la BBDD
        if not establecimiento:
            return Response(
                {"error": "El CIF introducido no figura en nuestra base de datos."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Si existe pero no tiene usuario (le creamos uno o usamos el existente)
        if not establecimiento.usuario:
            # Buscamos si ya hay un usuario con ese nombre (CIF) o lo creamos
            user, _ = User.objects.get_or_create(
                username=cif_limpio, email=establecimiento.correo
            )
            establecimiento.usuario = user
            establecimiento.save()

        # Generamos el token para React
        refresh = RefreshToken.for_user(establecimiento.usuario)

        datos = model_to_dict(establecimiento)
        datos["id_establecimiento"] = establecimiento.id_establecimiento
        datos["access"] = str(refresh.access_token)

        return Response(datos, status=200)

    except Exception as e:
        print(f"Error en buscar_cif: {e}")
        return Response({"error": "Error interno del servidor"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ver_mi_local(request):
    try:
        # Importante: busca por el campo 'usuario'
        establecimiento = Establecimiento.objects.get(usuario=request.user)
        return Response(model_to_dict(establecimiento))
    except Establecimiento.DoesNotExist:
        return Response({"error": "No tienes un establecimiento asociado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


from rest_framework import viewsets, permissions
from .models import Servicio, Usuario
from .serializers import ServicioSerializer
from rest_framework.decorators import action


class ServicioViewSet(viewsets.ModelViewSet):
    """
    Esta vista se encarga de:
    1. RECIBIR el JSON de React (vía Serializer).
    2. VALIDAR que los datos sean correctos.
    3. GUARDAR el servicio asociándolo al usuario que tiene el token.
    """

    serializer_class = ServicioSerializer
    # Solo dejamos entrar a los usuarios que tenga el Token JWT (logueados)
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """
        Configura permisos dinámicos:
        - 'list' y 'retrieve' (ver servicios): Permitido para todos.
        - 'create', 'update', 'destroy': Solo para usuarios logueados.
        """
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """
        Si es una búsqueda (list), devolvemos todos los servicios para que salgan en el mapa.
        Si el usuario está logueado y quiere gestionar sus servicios, filtramos por los suyos.
        """
        # Si hay un parámetro 'cp' en la URL (proviene del buscador de React)
        cp = self.request.query_params.get("cp")
        if cp:
            return Servicio.objects.filter(cp=cp)

        # Si el usuario está logueado y entra en su panel de gestión
        if self.request.user.is_authenticated and not cp:
            try:
                return Servicio.objects.filter(
                    id_usuario__auth_id=self.request.user.username
                )
            except Exception:
                return Servicio.objects.none()

        # Por defecto para la API pública
        return Servicio.objects.all()

    def perform_create(self, serializer):
        """
        Asocia el servicio al usuario y HEREDA automáticamente
        la ubicación de su establecimiento para el mapa.
        """
        try:
            # Obtenemos el perfil del usuario logueado a través de su auth_id (que es el username del User)
            usuario_perfil = Usuario.objects.get(auth_id=self.request.user.username)

            # Buscamos su establecimiento para copiar las coordenadas y el CP
            establecimiento = Establecimiento.objects.get(usuario=self.request.user)

            # 3. Guardamos el servicio con toda la información necesaria
            serializer.save(
                id_usuario=usuario_perfil,
                lat=establecimiento.latitud,
                lng=establecimiento.longitud,
                cp=establecimiento.cp,
            )
        except Usuario.DoesNotExist:
            from rest_framework.exceptions import ValidationError

            raise ValidationError("El perfil de usuario no existe.")
        except Establecimiento.DoesNotExist:
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                "Debes registrar un establecimiento antes de ofrecer servicios."
            )
@api_view(["GET"])
@permission_classes([AllowAny])
def lista_solicitudes_ayuda(request):
    try:
        # Consultamos los datos reales de la tabla 'solicitud_ayuda'
        solicitudes = SolicitudAyuda.objects.all().order_by('-fecha_creacion')
        
        # Formateamos el JSON exactamente como lo espera tu componente de React
        data = []
        for s in solicitudes:
            data.append({
                "nombre_completo": s.nombre_completo,
                "cp": s.cp,
                "telefono": s.telefono,
                "requiere_llamada": s.requiere_llamada,
                "encuesta_enviada": s.encuesta_enviada,
                "puntuacion": s.puntuacion if s.puntuacion else 0
            })
        
        return Response(data, status=200)
    except Exception as e:
        print(f"Error al obtener solicitudes: {e}")
        return Response([], status=500)

def dashboard_stats(request):
    PROPERTY_ID = "530848880"

    try:
        data = get_visitor_count(PROPERTY_ID)
        return JsonResponse({"status": "success", "data": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    
def analytics_dashboard_view(request):
    try:
        # Intentamos traer los datos reales de Analytics
        try:
            visitas_reales = get_google_analytics_data()
            total_visitas = sum(item['usuarios'] for item in visitas_reales) if visitas_reales else 100

        except:
            visitas_reales = [] # Si falla la API de Google, enviamos lista vacía
            total_visitas = 100 # Valor por defecto si falla Google

        total_ventas = Pedido.objects.count()
        ratio = (total_ventas / total_visitas * 100) if total_visitas > 0 else 0

        data = {
            "visitas": visitas_reales if visitas_reales else [
                {"fecha": "01 Abr", "usuarios": 5},
                {"fecha": "02 Abr", "usuarios": 12},
                {"fecha": "03 Abr", "usuarios": 8},
            ],
            "conversion": [
                {"nombre": "Visitas", "valor": total_visitas},
                {"nombre": "Ventas", "valor": total_ventas}
            ],
            "ratio_conversion": f"{ratio:.2f}%"
        }
        return JsonResponse(data, safe=False)
    except Exception as e:
        # Esto dice el error exacto en el navegador si algo falla
        return JsonResponse({"status": "error", "message": str(e)}, status=500)    