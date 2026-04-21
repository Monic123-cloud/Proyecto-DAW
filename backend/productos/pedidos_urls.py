from django.urls import path
from . import pedidos_views

urlpatterns = [
    path("crear/", pedidos_views.crear_pedidos, name="crear_pedidos"),
    path("me/", pedidos_views.mis_pedidos, name="pedidos_me"),
    path("<int:id_pedido>/", pedidos_views.pedido_detalle, name="pedido_detalle"),
]