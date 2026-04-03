from django import forms
from django.contrib import admin
from .models import Establecimiento ,SolicitudAyuda, Voluntario , EncuestaSatisfaccion


@admin.register(Establecimiento)
class EstablecimientoAdmin(admin.ModelAdmin):
    # Esto es lo que verás en la tabla del panel /admin
    list_display = ("nombre_comercio", "tipo_negocio", "municipio", "provincia", "cp")

    # Permite buscar por nombre o ciudad
    search_fields = ("nombre_comercio", "municipio", "provincia", "cif_nif")

    # Añade filtros rápidos a la derecha
    list_filter = ("tipo_negocio", "grupo", "categoria")

admin.site.register(Voluntario)
admin.site.register(EncuestaSatisfaccion)


class SolicitudAyudaForm(forms.ModelForm):
    class Meta:
        model = SolicitudAyuda
        fields = '__all__'
        widgets = {
            # Esto activa el selector de año y mes de HTML5
            'fecha_nacimiento': forms.DateInput(attrs={'type': 'date'}),
        }

@admin.register(SolicitudAyuda)
class SolicitudAyudaAdmin(admin.ModelAdmin):
    form = SolicitudAyudaForm # Le decimos al admin que use nuestro formulario
    list_display = ('nombre_completo', 'cp', 'telefono', 'requiere_llamada')
    list_filter = ('requiere_llamada', 'encuesta_enviada')