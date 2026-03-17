from django.contrib import admin
from .models import Establecimiento  # Importamos tu modelo


@admin.register(Establecimiento)
class EstablecimientoAdmin(admin.ModelAdmin):
    # Esto es lo que verás en la tabla del panel /admin
    list_display = ("nombre_comercio", "tipo_negocio", "municipio", "provincia", "cp")

    # Permite buscar por nombre o ciudad
    search_fields = ("nombre_comercio", "municipio")

    # Añade filtros rápidos a la derecha
    list_filter = ("tipo_negocio", "grupo", "categoria")
