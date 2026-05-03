from django.contrib import admin
from .models import (
    Establecimiento,
    Valoracion,
    Voluntario,
    SolicitudAyuda,
    EncuestaSatisfaccion,
    Servicio,
    Producto,
    Evento,
    Pedido,
    DetallePedido,
)  # Importamos modelo


@admin.register(Establecimiento)
class EstablecimientoAdmin(admin.ModelAdmin):
    # tabla del panel /admin
    list_display = ("nombre_comercio", "tipo_negocio", "municipio", "provincia", "cp")

    # Permite buscar por nombre o ciudad
    search_fields = ("nombre_comercio", "municipio", "provincia", "cif_nif")

    # Añade filtros rápidos a la derecha
    list_filter = ("tipo_negocio", "grupo", "categoria")


@admin.register(Valoracion)
class ValoracionAdmin(admin.ModelAdmin):
    list_display = (
        "id_valoracion",
        "id_usuario",
        "id_establecimiento",
        "puntuacion",
        "fecha",
    )
    list_filter = ("puntuacion", "fecha")
    # Buscamos por Email del usuario y por su CIF/NIF (username)
    search_fields = (
        "id_usuario__email",
        "id_usuario__username",
        "id_establecimiento__nombre_comercio",
        "comentario",
    )


# Configuración de Voluntariado y Ayuda
@admin.register(Voluntario)
class VoluntarioAdmin(admin.ModelAdmin):
    list_display = (
        "usuario",
        "cp",
        "dias_disponibles",
        "horario_inicio",
        "horario_fin",
        "activo",
    )
    list_filter = ("activo", "cp")
    search_fields = ("usuario__email", "cp")


@admin.register(SolicitudAyuda)
class SolicitudAyudaAdmin(admin.ModelAdmin):
    # la lista
    list_display = (
        "nombre_completo",
        "email",
        "cp",
        "fecha_creacion",
        "requiere_llamada",
    )
    list_filter = ("cp", "requiere_llamada", "encuesta_enviada")
    search_fields = ("nombre_completo", "email", "cp")

    # Formulario de edición
    fieldsets = (
        (
            "Datos del Solicitante",
            {"fields": ("nombre_completo", "email", "telefono", "fecha_nacimiento")},
        ),
        (
            "Detalles de la Solicitud",
            {"fields": ("cp", "descripcion", "requiere_llamada")},
        ),
        (
            "Estado y Seguimiento",
            {
                "fields": ("encuesta_enviada", "puntuacion", "fecha_creacion"),
            },
        ),
    )

    # Marcamos como solo lectura los campos automáticos o calculados
    readonly_fields = ("fecha_creacion",)


@admin.register(EncuestaSatisfaccion)
class EncuestaSatisfaccionAdmin(admin.ModelAdmin):
    list_display = ("solicitud", "puntuacion", "fecha_completada")


# Servicios
@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ("id_usuario", "categoria", "precio_hora", "fecha_creacion")


# Gestión de Pedidos
@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ("id_pedido", "id_usuario", "importe_total", "estado", "fecha")
    list_filter = ("estado", "fecha")


@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ("id_pedido", "id_producto", "cantidad", "precio_unitario")


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ("nombre_evento", "id_usuario", "categoria", "fecha", "lugar")
