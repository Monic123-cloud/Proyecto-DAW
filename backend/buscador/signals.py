from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date
from .models import SolicitudAyuda, Voluntario


@receiver(post_save, sender=SolicitudAyuda)
def matching_por_cp(sender, instance, created, **kwargs):
    if not created:
        return

    print(f"\n[SIGNAL] Nueva solicitud: {instance.nombre_completo} - CP {instance.cp}")

    # ✔ CALCULAR EDAD AQUÍ
    es_mayor = False
    if instance.fecha_nacimiento:
        edad = (date.today() - instance.fecha_nacimiento).days // 365
        es_mayor = edad >= 65

    # ✔ MATCHING POR CP
    voluntarios = Voluntario.objects.filter(cp=instance.cp, activo=True)

    for v in voluntarios:
        print(f"📧 (SIMULADO EMAIL) {v.usuario.email}")

    # ✔ MARCAR LLAMADA SI ES MAYOR
    if es_mayor:
        SolicitudAyuda.objects.filter(id=instance.id).update(
            requiere_llamada=True
        )
        print(f"📞 Llamada requerida: {instance.nombre_completo}")