from django.apps import AppConfig


class BuscadorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'buscador'

class TuAppConfig(AppConfig):
    name = 'tu_app_name'

    def ready(self):
        import tu_app_name.signals # Esto activa los signals al iniciar la aplicación.