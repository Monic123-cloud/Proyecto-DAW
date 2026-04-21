from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from knox.auth import TokenAuthentication

from .models import Establecimiento, Pedido, DetallePedido, Producto

def get_est(user):
    # usuario.id del auth_user
    est = Establecimiento.objects.filter(usuario_id=user.id).first()
    return est

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mi_establecimiento(request):
    est = get_est(request.user)
    if not est:
        return Response({"ok": False, "error": "No hay establecimiento asociado a este usuario"}, status=404)

    data = Establecimiento.objects.filter(id_establecimiento=est.id_establecimiento).values(
        "id_establecimiento","nombre_comercio","cif_nif","tipo_negocio","grupo","categoria","subcategoria",
        "telefono","correo","direccion","numero","municipio","provincia","cp","latitud","longitud","url_web","usuario_id"
    ).first()
    return Response({"ok": True, "establecimiento": data})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mis_productos(request):
    est = get_est(request.user)
    if not est:
        return Response({"ok": False, "items": []})

    items = list(
        Producto.objects.filter(id_establecimiento=est.id_establecimiento)
        .values("id_producto","tipo_producto","producto","stock","precio","id_establecimiento")
        .order_by("-id_producto")
    )
    return Response({"ok": True, "items": items})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mis_pedidos(request):
    est = get_est(request.user)
    if not est:
        return Response({"ok": False, "items": []})

    items = list(
        Pedido.objects.filter(id_establecimiento=est.id_establecimiento)
        .values("id_pedido","importe_total","fecha","metodo_pago","descuento","metodo_entrega","estado","id_establecimiento","id_usuario")
        .order_by("-fecha")
    )
    return Response({"ok": True, "items": items})

def _mi_establecimiento(user):
    # Tu tabla usa usuario_id (int), no FK
    return Establecimiento.objects.filter(usuario_id=user.id).first()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_pedido_detalle(request, id_pedido: int):
    """
    Devuelve el detalle (líneas) de un pedido SOLO si pertenece al establecimiento del comercio autenticado.
    """
    est = _mi_establecimiento(request.user)
    if not est:
        return Response({"ok": False, "error": "Este usuario no tiene establecimiento."}, status=404)

    pedido = Pedido.objects.filter(id_pedido=id_pedido, id_establecimiento=est.id_establecimiento).first()
    if not pedido:
        return Response({"ok": False, "error": "Pedido no encontrado para este establecimiento."}, status=404)

    # líneas de detalle
    lineas = list(
        DetallePedido.objects.filter(id_pedido=pedido.id_pedido).values(
            "id_detalle",
            "id_producto",
            "cantidad",
            "precio_unitario",
        )
    )

    # mapear id_producto -> nombre producto
    ids_prod = [l["id_producto"] for l in lineas]
    nombres = {
        p["id_producto"]: p["producto"]
        for p in Producto.objects.filter(id_producto__in=ids_prod).values("id_producto", "producto")
    }

    out = []
    for l in lineas:
        cantidad = int(l["cantidad"] or 0)
        precio = float(l["precio_unitario"] or 0)
        out.append(
            {
                "id_detalle": l["id_detalle"],
                "id_producto": l["id_producto"],
                "producto": nombres.get(l["id_producto"], f"Producto #{l['id_producto']}"),
                "cantidad": cantidad,
                "precio_unitario": precio,
                "subtotal": round(cantidad * precio, 2),
            }
        )

    return Response(
        {
            "ok": True,
            "pedido": {
                "id_pedido": pedido.id_pedido,
                "fecha": pedido.fecha,
                "estado": pedido.estado,
                "metodo_pago": pedido.metodo_pago,
                "metodo_entrega": pedido.metodo_entrega,
                "importe_total": float(pedido.importe_total or 0),
                "id_usuario": pedido.id_usuario,
                "id_establecimiento": pedido.id_establecimiento,
            },
            "lineas": out,
        }
    )