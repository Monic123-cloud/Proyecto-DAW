import requests
from django.conf import settings
from django.forms.models import model_to_dict
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

from .models import Establecimiento, Servicio, SolicitudAyuda, Valoracion
from .serializers import EstablecimientoSerializer, ServicioSerializer, ValoracionSerializer

# Si en tu config/urls.py lo importas, lo dejo para que no reviente:
def analytics_dashboard_view(request):
    return Response({"ok": True, "msg": "Analytics placeholder"}, status=200)


class BuscadorAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cp_buscado = request.query_params.get("cp")
        radio_km = float(request.query_params.get("radio", 5) or 5)

        user_lat = request.query_params.get("lat")
        user_lng = request.query_params.get("lng")

        api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", "")

        comercios = Establecimiento.objects.all()
        data_final = []

        # Filtrado aproximado por distancia si vienen coords
        if user_lat and user_lng:
            try:
                user_lat = float(user_lat)
                user_lng = float(user_lng)

                # Devolvemos los locales con coords y calculamos distancia
                for c in comercios:
                    if c.latitud is None or c.longitud is None:
                        continue

                    dist = geodesic((user_lat, user_lng), (float(c.latitud), float(c.longitud))).km
                    if dist <= radio_km:
                        data_final.append(
                            {
                                "id_establecimiento": c.id_establecimiento,
                                "nombre_comercio": c.nombre_comercio,
                                "direccion": c.direccion,
                                "latitud": float(c.latitud),
                                "longitud": float(c.longitud),
                                "tipo": "local",
                                "promedio_valoraciones": c.promedio_valoraciones,
                                "numero_valoraciones": c.numero_valoraciones,
                            }
                        )
            except Exception:
                pass

        # Si viene CP, filtro simple
        if cp_buscado:
            comercios = comercios.filter(cp=cp_buscado)

        # Añade los locales filtrados por CP si no entró por coords
        if cp_buscado and not (user_lat and user_lng):
            serializer = EstablecimientoSerializer(comercios, many=True)
            data_final = serializer.data

        # Google places (opcional)
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
                                "direccion": place.get("vicinity") or place.get("formatted_address"),
                                "tipo": "google",
                                "promedio_valoraciones": place.get("rating", 0),
                                "numero_valoraciones": place.get("user_ratings_total", 0),
                            }
                        )
                except Exception as e:
                    print(f"Error en Google Maps API: {e}")

        return Response(data_final)


class GeolocalizadorAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return BuscadorAPIView().get(request)

    def post(self, request):
        direccion = request.data.get("direccion")
        geolocator = Nominatim(user_agent="mi_buscador_daw")
        try:
            location = geolocator.geocode(direccion)
            if location:
                return Response({"lat": location.latitude, "lng": location.longitude, "address": location.address})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        return Response({"status": "No se encontró la dirección"}, status=404)


class GoogleMapsProxyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        location = request.query_params.get("location")
        radius = request.query_params.get("radius", "1500")
        api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", "")

        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&key={api_key}"
        response = requests.get(url)
        return Response(response.json())


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def buscar_cif(request, cif):
    try:
        cif_limpio = cif.strip().upper()
        establecimiento = Establecimiento.objects.filter(cif_nif__iexact=cif_limpio).first()

        if not establecimiento:
            return Response({"error": "El CIF introducido no figura en nuestra base de datos."}, status=status.HTTP_404_NOT_FOUND)

        # Si existe pero no tiene usuario: lo vinculamos/creamos
        if not establecimiento.usuario:
            User = get_user_model()
            user, _ = User.objects.get_or_create(
                username=cif_limpio,
                defaults={"email": establecimiento.correo or ""},
            )
            establecimiento.usuario = user
            establecimiento.save()

        # En tu proyecto real, esto ya lo resuelve /login/ con knox/jwt
        datos = model_to_dict(establecimiento)
        datos["id_establecimiento"] = establecimiento.id_establecimiento
        return Response(datos, status=200)

    except Exception as e:
        print(f"Error en buscar_cif: {e}")
        return Response({"error": "Error interno del servidor"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ver_mi_local(request):
    try:
        establecimiento = Establecimiento.objects.get(usuario=request.user)
        return Response(model_to_dict(establecimiento))
    except Establecimiento.DoesNotExist:
        return Response({"error": "No tienes un establecimiento asociado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


class ServicioViewSet(viewsets.ModelViewSet):
    serializer_class = ServicioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        cp = self.request.query_params.get("cp")
        if cp:
            return Servicio.objects.filter(cp=cp)

        if self.request.user.is_authenticated and not cp:
            return Servicio.objects.filter(id_usuario=self.request.user)

        return Servicio.objects.all()

    def perform_create(self, serializer):
        from rest_framework.exceptions import ValidationError

        # ✅ Hereda ubicación del establecimiento del usuario logueado
        try:
            est = Establecimiento.objects.get(usuario=self.request.user)
        except Establecimiento.DoesNotExist:
            raise ValidationError("Debes registrar un establecimiento antes de ofrecer servicios.")

        serializer.save(
            id_usuario=self.request.user,
            lat=est.latitud,
            lng=est.longitud,
            cp=est.cp,
        )


class ValoracionViewSet(viewsets.ModelViewSet):
    queryset = Valoracion.objects.all()
    serializer_class = ValoracionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


@api_view(["GET"])
@permission_classes([AllowAny])
def lista_solicitudes_ayuda(request):
    try:
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