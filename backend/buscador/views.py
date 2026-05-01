from django.shortcuts import render
import os
import json
from rest_framework.views import APIView  # # Clase base para crear tu endpoint de API
from rest_framework.response import (
    Response,
)  # Se encarga de enviar los datos en formato JSON a React
from rest_framework.permissions import (
    BasePermission,
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
    ProductoSerializer,
    ServicioSerializer,
    EstablecimientoSerializer,
)  # Para convertir los datos de la base de datos a formato JSON que React entiende
from .models import (
    Servicio,
    Valoracion,
    SolicitudAyuda,
    Producto

)  # Importamos el modelo de Servicio y setting para gestionar
from django.contrib.auth import get_user_model
from django.http import JsonResponse
import google.generativeai as genai
from .models import Establecimiento
from config.analytics_service import get_google_analytics_data, get_conversion_data
from django.contrib.auth import authenticate

User = (
    get_user_model()
)  # Para usar el modelo de usuario personalizado que hemos creado en users/models.py

""" "Es el controlador que gestiona la lógica de negocio, procesando las peticiones de búsqueda para devolver resultados
de la base de datos local y la API de Google Maps en formato JSON."""


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


# API de búsqueda (Para React). devuelve datos (JSON). Es la que consume React para mostrar los resultados de búsqueda en el mapa. Lee los parámetros de búsqueda (lat/lng o CP) y devuelve una lista de comercios que cumplen esos criterios, tanto de la base de datos local como de Google Maps.
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
        api_key = settings.GOOGLE_MAPS_API_KEY

        data_final = []

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

        for c in comercios:
            data_final.append(
                {
                    "id_establecimiento": c.id_establecimiento,
                    "nombre_comercio": c.nombre_comercio,
                    "latitud": float(c.latitud),
                    "longitud": float(c.longitud),
                    "tipo": "comercio_propio",  # Para que React sepa que es AZUL
                    "cp": c.cp,
                }
            )

        servicios = Servicio.objects.all()
        if user_lat and user_lng:
            lat1 = Radians(float(user_lat))
            lng1 = Radians(float(user_lng))
            servicios = (
                servicios.annotate(
                    distancia=ExpressionWrapper(
                        6371
                        * ACos(
                            Cos(lat1)
                            * Cos(Radians(F("lat")))
                            * Cos(Radians(F("lng")) - lng1)
                            + Sin(lat1) * Sin(Radians(F("lat")))
                        ),
                        output_field=FloatField(),
                    )
                )
                .filter(distancia__lte=radio_km)
                .order_by("distancia")
            )
        elif cp_buscado:
            servicios = servicios.filter(cp=cp_buscado)

        for serv in servicios:
            data_final.append(
                {
                    "id_establecimiento": f"serv-{serv.id_servicio}",  # ID único para evitar conflictos
                    "nombre_comercio": serv.categoria,
                    "direccion": serv.descripcion,
                    "latitud": float(serv.lat),
                    "longitud": float(serv.lng),
                    "tipo": "servicio_propio",  # Identificador para el color verde en React
                    "cp": serv.cp,
                }
            )

        # Preparamos los datos locales
        serializer_est = EstablecimientoSerializer(comercios, many=True)
        serializer_serv = ServicioSerializer(servicios, many=True)

        # 2: Busca en EN GOOGLE MAPS
        # Solo llamamos a Google si el usuario ha puesto un CP o coordenadas
        api_key = os.getenv("GOOGLE_MAPS_API_KEY", "")

        # Busca en GOOGLE MAPS (Rojos)
        if api_key:
            google_url = None
            if user_lat and user_lng:
                google_url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={user_lat},{user_lng}&radius={radio_km * 1000}&type=store&region=es&key={api_key}"
            elif cp_buscado:
                google_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=comercios+en+CP+{cp_buscado}+Spain&region=es&type=store&key={api_key}"

            if google_url:
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
                                "direccion": place.get("vicinity")
                                or place.get("formatted_address"),
                                "tipo": "google",  # Identificador para el color rojo en React
                                "promedio_valoraciones": place.get("rating", 0),
                                "numero_valoraciones": place.get(
                                    "user_ratings_total", 0
                                ),
                            }
                        )
                except Exception as e:
                    print(f"Error en Google Maps API: {e}")

        return Response(data_final)


# 3. Geolocalizador. convertir una dirección de texto en coordenadas geográficas.
class GeolocalizadorAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        buscador = BuscadorAPIView()
        return buscador.get(request)

        

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
        api_key = os.getenv(
            "GOOGLE_MAPS_API_KEY", ""
        )  # lee la clave secreta desde la variable de entorno

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
                    cif_nif=cif_nif.strip().upper(),
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


@api_view(["POST"])
@permission_classes([AllowAny])
def buscar_y_login_por_cif(request, cif):
    """
    Punto de entrada para usuarios registrados.
    Valida CIF + Password y devuelve los datos del local + Token.
    """
    password = request.data.get("password")
    cif_limpio = cif.strip().upper()

    try:
        # 1. Buscamos el local por CIF
        local = Establecimiento.objects.get(cif_nif__iexact=cif_limpio)

        # 2. Verificamos que tenga usuario
        if not local.usuario:
            return Response(
                {"error": "Ficha sin usuario asociado. Contacte con soporte."},
                status=400,
            )

        # 3. Autenticamos contra auth_user usando el username del usuario vinculado
        user = authenticate(username=local.usuario.username, password=password)

        if user is not None:
            # Generamos token real
            refresh = RefreshToken.for_user(user)
            refresh["tipo"] = "comercio"
            serializer = EstablecimientoSerializer(local)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    #"tipo": "comercio",
                    **serializer.data,  # Enviamos todos los datos del local
                },
                status=200,
            )
        else:
            return Response(
                {"error": "Contraseña incorrecta para este CIF/NIF."}, status=401
            )

    except Establecimiento.DoesNotExist:
        return Response(
            {"error": "No existe ningún negocio con ese CIF/NIF."}, status=404
        )


@api_view(["GET", "POST"])
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
from .models import Servicio
from .serializers import ServicioSerializer
from rest_framework.decorators import action
from .models import Valoracion
from .serializers import ValoracionSerializer

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        return obj.id_usuario == request.user

class ServicioViewSet(viewsets.ModelViewSet):
    """
    Esta vista se encarga de:
    1. RECIBIR el JSON de React (vía Serializer).
    2. VALIDAR que los datos sean correctos.
    3. GUARDAR el servicio asociándolo al usuario que tiene el token.
    """
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    # Solo dejamos entrar a los usuarios que tenga el Token JWT (logueados)
    permission_classes = [permissions.IsAuthenticated,IsOwnerOrReadOnly]

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
                    usuario=self.request.user
                )
            except Exception:
                return Servicio.objects.none()

        # Por defecto para la API pública
        return Servicio.objects.all()
    def perform_create(self, serializer):
        user = self.request.user

        serializer.save(  
            lat=user.latitud,
            lng=user.longitud,
            cp=user.cp,
        )

    """  
   def perform_create(self, serializer):
       
        Asocia el servicio al usuario y HEREDA automáticamente
        la ubicación de su establecimiento para el mapa.
        
        from users.models import CustomUser

        try:
            # Obtenemos el perfil del usuario logueado a través de su auth_id (que es el username del User)
            usuario_perfil = CustomUser.objects.get(auth_id=self.request.user.username)

            # Guardamos el servicio con toda la información necesaria
            serializer.save(
                id_usuario=usuario_perfil,
                lat=usuario_perfil.latitud,
                lng=usuario_perfil.longitud,
                cp=usuario_perfil.cp,
            )
        except CustomUser.DoesNotExist:
            from rest_framework.exceptions import ValidationError

            raise ValidationError("El perfil de usuario no existe.")
        except Establecimiento.DoesNotExist:
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                "Debes registrar un establecimiento antes de ofrecer servicios."
            ) """


class ValoracionViewSet(viewsets.ModelViewSet):
    queryset = Valoracion.objects.all()
    serializer_class = ValoracionSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]  # Solo usuarios logueados pueden valorar

    def perform_create(self, serializer):
        from users.models import CustomUser
        from rest_framework.exceptions import ValidationError

        try:
            # SEGURIDAD: Verificamos que el usuario del token existe en nuestra tabla CustomUser
            # Buscamos por username (que es el CIF/DNI)
            usuario_validado = CustomUser.objects.get(email=self.request.user.email)

            # ACCIÓN: Guardamos la valoración usando ese perfil ya verificado
            serializer.save(id_usuario=usuario_validado)

        except CustomUser.DoesNotExist:
            # Si el token es válido pero por algún motivo el usuario no está en la BBDD
            raise ValidationError("Error de seguridad: El perfil de usuario no existe.")


@api_view(["GET"])
@permission_classes([AllowAny])
def lista_solicitudes_ayuda(request):
    """
    Recupera las solicitudes reales de la tabla 'solicitud_ayuda' para React.
    """
    try:
        # Traemos las solicitudes reales ordenadas por fecha (las más nuevas primero)
        solicitudes = SolicitudAyuda.objects.all().order_by("-fecha_creacion")

        data = []
        for s in solicitudes:
            data.append(
                {
                    "nombre_completo": s.nombre_completo,
                    "cp": s.cp,
                    "telefono": s.telefono,
                    "requiere_llamada": s.requiere_llamada,
                    "encuesta_enviada": s.encuesta_enviada,
                }
            )
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([AllowAny])
def analytics_dashboard_view(request):
    """
    Conecta Google Analytics con el Dashboard de React.
    Utiliza el servicio externo definido en config/analytics_service.py
    """
    try:
        visitas = get_google_analytics_data()
        conversion = get_conversion_data()

        return Response(
            {
                "visitas": visitas,
                "conversion": conversion,
            }
        )
    except Exception as e:
        # Si el servicio de Analytics falla, devolvemos el error para que React lo gestione
        return Response({"error": f"Error en Analytics: {str(e)}"}, status=500)


@api_view(["GET"])
@permission_classes([AllowAny])
def analizar_mercado(request):
    import google.generativeai as genai
    from django.http import JsonResponse
    import json

    try:
        cp = request.GET.get("cp")
        if not cp:
            return JsonResponse({"error": "Falta el parámetro CP"}, status=400)
        # Configuración básica
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            return JsonResponse({"error": "No hay API KEY en el .env"}, status=500)

        genai.configure(api_key=api_key)

        # automáticamente detectamos un modelo válido
        modelo_valido = None
        for m in genai.list_models():
            if "generateContent" in m.supported_generation_methods:
                modelo_valido = m.name
                break  # Usamos el primero que soporte generar contenido

        if not modelo_valido:
            return JsonResponse(
                {"error": "Tu API Key no tiene modelos disponibles"}, status=500
            )

        # Preparar contexto de base de datos
        cp_limpio = str(cp).strip()
        locales = Establecimiento.objects.filter(cp=cp_limpio).values_list(
            "categoria", flat=True
        )
        lista_contexto = ", ".join(set(locales)) if locales else "ninguno"

        # Generación con el modelo detectado
        model = genai.GenerativeModel(modelo_valido)
        prompt = f"""
        Analiza el CP {cp_limpio} en España. Actualmente hay: {lista_contexto}.
        Dime 3 negocios que faltan. Responde SOLO un JSON:
        {{
            "cp": "{cp_limpio}",
            "recomendaciones": [
                {{"negocio": "tipo", "razon": "explicación"}}
            ]
        }}
        """

        response = model.generate_content(prompt)

        # Limpieza y respuesta
        res_text = response.text
        if "```" in res_text:
            res_text = res_text.split("```")[1].replace("json", "").strip()

        return JsonResponse({"status": "success", "data": json.loads(res_text)})

    except Exception as e:
        return JsonResponse(
            {
                "status": "error",
                "message": str(e),
                "modelo_intentado": (
                    modelo_valido if "modelo_valido" in locals() else "ninguno"
                ),
            },
            status=500,
        )
class ProductoViewSet(viewsets.ModelViewSet):
    """
    API para listar y gestionar productos de los comercios.

    - GET /api/buscador/productos/  -> público
    - GET /api/buscador/productos/?q=pan&cp=28942 -> búsqueda pública
    - POST/PUT/DELETE -> reservado a usuarios autenticados
    """

    serializer_class = ProductoSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        from django.db.models import Q

        queryset = Producto.objects.select_related("id_establecimiento").all().order_by("producto")

        # En acciones privadas, el comercio solo puede gestionar sus propios productos.
        if self.action not in ["list", "retrieve"] and self.request.user.is_authenticated:
            queryset = queryset.filter(id_establecimiento__usuario=self.request.user)

        q = self.request.query_params.get("q")
        tipo = self.request.query_params.get("tipo")
        cp = self.request.query_params.get("cp")
        establecimiento = self.request.query_params.get("establecimiento")

        if q:
            queryset = queryset.filter(
                Q(producto__icontains=q)
                | Q(tipo_producto__icontains=q)
                | Q(id_establecimiento__nombre_comercio__icontains=q)
            )

        if tipo:
            queryset = queryset.filter(tipo_producto__icontains=tipo)

        if cp:
            queryset = queryset.filter(id_establecimiento__cp=cp)

        if establecimiento:
            queryset = queryset.filter(id_establecimiento_id=establecimiento)

        return queryset

    def perform_create(self, serializer):
        from rest_framework.exceptions import ValidationError

        try:
            establecimiento = Establecimiento.objects.get(usuario=self.request.user)
            serializer.save(id_establecimiento=establecimiento)
        except Establecimiento.DoesNotExist:
            raise ValidationError("Debes tener un comercio asociado para crear productos.")



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def descontar_stock_productos(request):
    """
    Descuenta stock de la tabla producto cuando el cliente finaliza una compra.

    Recibe desde React un JSON con esta estructura:
    {
        "items": [
            {"id_producto": 1, "cantidad": 2}
        ]
    }

    Importante:
    - Comprueba que hay stock suficiente.
    - Descuenta las unidades de forma segura usando transaction.atomic().
    - Todavía no crea registros en las tablas pedido / detalle_pedido.
    """

    from django.db import transaction

    items = request.data.get("items", [])

    if not items:
        return Response(
            {"error": "No hay productos en el carrito."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    productos_actualizados = []

    try:
        with transaction.atomic():
            for item in items:
                # Aceptamos ambos nombres por seguridad:
                # id_producto/cantidad desde el checkout nuevo
                # id/qty por si viene directamente del carrito
                id_producto = item.get("id_producto") or item.get("id")
                cantidad = item.get("cantidad") or item.get("qty") or 0

                try:
                    cantidad = int(cantidad)
                except (TypeError, ValueError):
                    return Response(
                        {"error": "La cantidad del producto no es válida."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if not id_producto or cantidad <= 0:
                    return Response(
                        {"error": "Producto o cantidad no válidos."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    producto = Producto.objects.select_for_update().get(
                        id_producto=id_producto
                    )
                except Producto.DoesNotExist:
                    return Response(
                        {"error": f"El producto con ID {id_producto} no existe."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                stock_actual = producto.stock or 0

                if stock_actual < cantidad:
                    return Response(
                        {
                            "error": (
                                f"No hay stock suficiente para {producto.producto}. "
                                f"Stock disponible: {stock_actual}"
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                producto.stock = stock_actual - cantidad
                producto.save(update_fields=["stock"])

                productos_actualizados.append(
                    {
                        "id_producto": producto.id_producto,
                        "producto": producto.producto,
                        "stock_restante": producto.stock,
                    }
                )

        return Response(
            {
                "mensaje": "Stock actualizado correctamente.",
                "productos": productos_actualizados,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": f"Error al descontar stock: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )