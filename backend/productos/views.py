from django.db import IntegrityError
from django.db.models import Max
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Producto, Establecimiento


@api_view(["GET"])
@permission_classes([AllowAny])
def establecimientos_con_productos(request):
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
            "usuario_id",
        )
        .order_by("nombre_comercio")
    )

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

    by_est = {}
    for p in prods:
        by_est.setdefault(p["id_establecimiento"], []).append(p)

    for e in ests:
        e["productos"] = by_est.get(e["id_establecimiento"], [])

    return Response(ests)


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Solo los logueados
def alta_producto(request):
    data = request.data

    try:
        # Encuentra el establecimiento del usuario autenticado
        est = Establecimiento.objects.filter(usuario_id=request.user.id).first()
        if not est:
            return Response(
                {"ok": False, "error": "Este usuario no tiene un establecimiento asociado"},
                status=404,
            )

        # Validaciones mínimas
        tipo_producto = (data.get("tipo_producto") or "").strip()
        producto = (data.get("producto") or "").strip()
        if not tipo_producto or not producto:
            return Response(
                {"ok": False, "error": "tipo_producto y producto son obligatorios"},
                status=400,
            )

        stock = int(data.get("stock") or 0)
        precio = float(data.get("precio") or 0)

        # Generar id_producto si tu tabla NO autoincrementa
        next_id = (Producto.objects.aggregate(m=Max("id_producto"))["m"] or 0) + 1

        p = Producto(
            id_producto=next_id,
            tipo_producto=tipo_producto,
            producto=producto,
            stock=stock,
            precio=precio,
            id_establecimiento=est.id_establecimiento,  # Esto hace que siempre este en su tienda
        )
        p.save()

        return Response({"ok": True, "id_producto": p.id_producto}, status=201)

    except IntegrityError as e:
        return Response({"ok": False, "error": str(e)}, status=400)
    except Exception as e:
        return Response({"ok": False, "error": str(e)}, status=500)