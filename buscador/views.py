from django.shortcuts import render
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

    return render(
        request,
        "mapa.html",
        {
            "comercios": comercios,
            "mi_id": request.session.get("establecimiento_id"),
        },
    )
