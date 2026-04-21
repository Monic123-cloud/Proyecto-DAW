from django.urls import path
from . import views

urlpatterns = [
    path("establecimientos/", views.establecimientos_con_productos, name="establecimientos_con_productos"),
    path("alta/", views.alta_producto, name="alta_producto"),
]