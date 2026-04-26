from django.apps import AppConfig


class BuscadorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'buscador'


    def ready(self):
        import buscador.signals # Esto activa los signals al iniciar la aplicación.