from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Establecimiento, Producto


@api_view(["GET"])
@permission_classes([AllowAny])
def establecimientos_con_productos(request):
    # Establecimientos
    ests = list(
        Establecimiento.objects.all()
        .values(
            "id_establecimiento",
            "nombre_comercio",
            "categoria",
            "telefono",
            "correo",
            "direccion",
            "numero",
            "municipio",
            "provincia",
            "cp",
            "url_web",
            "tipo_negocio",
            "grupo",
            "subcategoria",
        )
        .order_by("nombre_comercio")
    )

    # Productos
    prods = list(
        Producto.objects.all().values(
            "id_producto",
            "tipo_producto",
            "producto",
            "stock",
            "precio",
            "id_establecimiento",
        )
    )

    # Agrupar productos por establecimiento
    by_est = {}
    for p in prods:
        by_est.setdefault(p["id_establecimiento"], []).append(p)

    # Anidar
    for e in ests:
        e["productos"] = by_est.get(e["id_establecimiento"], [])

    return Response(ests)