from decimal import Decimal
from django.db import IntegrityError, transaction
from django.db.models import Max
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Pedido, DetallePedido, Producto


def _user_id_from_request(request) -> int:
    # Tu CustomUser puede tener id_usuario o id
    return int(getattr(request.user, "id_usuario", None) or getattr(request.user, "id", 0))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mis_pedidos(request):
    """
    GET /api/pedidos/me/
    """
    user_id = _user_id_from_request(request)

    qs = (
        Pedido.objects.filter(id_usuario=user_id)
        .order_by("-fecha", "-id_pedido")
        .values(
            "id_pedido",
            "importe_total",
            "fecha",
            "metodo_pago",
            "descuento",
            "metodo_entrega",
            "estado",
            "id_establecimiento",
            "id_usuario",
        )
    )
    return Response({"ok": True, "items": list(qs)}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pedido_detalle(request, id_pedido: int):
    """
    GET /api/pedidos/<id_pedido>/
    Devuelve cabecera + líneas (solo si el pedido pertenece al usuario).
    """
    user_id = _user_id_from_request(request)

    pedido = (
        Pedido.objects.filter(id_pedido=id_pedido, id_usuario=user_id)
        .values(
            "id_pedido",
            "importe_total",
            "fecha",
            "metodo_pago",
            "descuento",
            "metodo_entrega",
            "estado",
            "id_establecimiento",
            "id_usuario",
        )
        .first()
    )
    if not pedido:
        return Response({"ok": False, "error": "Pedido no encontrado"}, status=404)

    lineas = list(
        DetallePedido.objects.filter(id_pedido=id_pedido).values(
            "id_detalle", "id_pedido", "id_producto", "cantidad", "precio_unitario"
        )
    )

    # Nombres de producto en bloque
    prod_ids = [l["id_producto"] for l in lineas]
    prods = Producto.objects.filter(id_producto__in=prod_ids).values("id_producto", "producto")
    nombre_por_id = {p["id_producto"]: p["producto"] for p in prods}

    for l in lineas:
        l["producto"] = nombre_por_id.get(l["id_producto"], f"Producto #{l['id_producto']}")
        l["subtotal"] = float(l["precio_unitario"]) * int(l["cantidad"])

    return Response({"ok": True, "pedido": pedido, "items": lineas}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def crear_pedidos(request):
    """
    POST /api/pedidos/crear/
    Crea 1 pedido por establecimiento + líneas en detalle_pedido.

    Body:
    {
      "metodo_pago": "tarjeta"|"paypal"|"bizum",
      "metodo_entrega": "domicilio"|"recogida",
      "descuento": 0,
      "items": [
        {"id_producto": 11, "id_establecimiento": 6, "cantidad": 2, "precio_unitario": 50.0},
        ...
      ]
    }
    """
    data = request.data
    user_id = _user_id_from_request(request)

    metodo_pago = (data.get("metodo_pago") or "tarjeta").strip()
    metodo_entrega = (data.get("metodo_entrega") or "recogida").strip()
    descuento_total = float(data.get("descuento") or 0)

    items = data.get("items") or []
    if not isinstance(items, list) or len(items) == 0:
        return Response({"ok": False, "error": "No hay items para crear el pedido"}, status=400)

    # Agrupar por establecimiento
    grupos = {}
    total_global = 0.0

    for it in items:
        try:
            id_producto = int(it.get("id_producto") or 0)
            id_est = int(it.get("id_establecimiento") or 0)
            cantidad = int(it.get("cantidad") or 0)
            precio_unit = float(it.get("precio_unitario") or 0)
        except Exception:
            continue

        if id_producto <= 0 or id_est <= 0 or cantidad <= 0 or precio_unit <= 0:
            continue

        subtotal = cantidad * precio_unit
        total_global += subtotal

        grupos.setdefault(id_est, []).append(
            {
                "id_producto": id_producto,
                "cantidad": cantidad,
                "precio_unitario": precio_unit,
                "subtotal": subtotal,
            }
        )

    if not grupos:
        return Response({"ok": False, "error": "Items inválidos"}, status=400)

    now = timezone.now()

    def descuento_para_est(total_est: float) -> float:
        if descuento_total <= 0 or total_global <= 0:
            return 0.0
        return round(descuento_total * (total_est / total_global), 2)

    try:
        with transaction.atomic():
            # IDs manuales (porque tus tablas son managed=False y puede no haber autoincrement real)
            next_pedido_id = (Pedido.objects.aggregate(m=Max("id_pedido"))["m"] or 0) + 1
            next_detalle_id = (DetallePedido.objects.aggregate(m=Max("id_detalle"))["m"] or 0) + 1

            created = []

            for id_est, lineas in grupos.items():
                total_est = sum(l["subtotal"] for l in lineas)
                desc_est = descuento_para_est(total_est)
                importe_total = max(0.0, round(total_est - desc_est, 2))

                pedido = Pedido(
                    id_pedido=next_pedido_id,
                    importe_total=importe_total,
                    fecha=now,
                    metodo_pago=metodo_pago,
                    descuento=desc_est,
                    metodo_entrega=metodo_entrega,
                    estado="pagado",
                    id_establecimiento=id_est,
                    id_usuario=user_id,
                )
                pedido.save()
                next_pedido_id += 1

                detalles = []
                for l in lineas:
                    detalles.append(
                        DetallePedido(
                            id_detalle=next_detalle_id,
                            id_pedido=pedido.id_pedido,
                            id_producto=int(l["id_producto"]),
                            cantidad=int(l["cantidad"]),
                            precio_unitario=Decimal(str(l["precio_unitario"])),
                        )
                    )
                    next_detalle_id += 1

                DetallePedido.objects.bulk_create(detalles)

                created.append(
                    {
                        "id_pedido": pedido.id_pedido,
                        "id_establecimiento": id_est,
                        "importe_total": importe_total,
                        "lineas": len(detalles),
                    }
                )

        return Response({"ok": True, "created": created}, status=201)

    except IntegrityError as e:
        # ✅ SIEMPRE JSON (no HTML)
        return Response({"ok": False, "error": f"IntegrityError: {str(e)}"}, status=400)
    except Exception as e:
        return Response({"ok": False, "error": str(e)}, status=500)