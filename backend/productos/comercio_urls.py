from django.urls import path
from . import comercio_views

urlpatterns = [
    path("me/", comercio_views.mi_establecimiento),
    path("me/productos/", comercio_views.mis_productos),
    path("me/pedidos/", comercio_views.mis_pedidos),
    path("me/pedidos/<int:id_pedido>/detalle/", comercio_views.me_pedido_detalle, name="comercio_pedido_detalle"),
]