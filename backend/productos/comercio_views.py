from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from knox.auth import TokenAuthentication

from .models import Establecimiento, Producto, Pedido

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