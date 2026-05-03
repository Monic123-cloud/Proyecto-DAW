from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import SolicitudAyuda, Voluntario


@receiver(post_save, sender=SolicitudAyuda)
def matching_por_cp(sender, instance, created, **kwargs):
    # Solo actuamos si la solicitud es nueva (se acaba de crear en la BBDD)
    if created:
        #prueba
        print(f"\n [SIGNAL] Nueva solicitud detectada: {instance.nombre_completo} en CP {instance.cp}")
        # Buscamos voluntarios que tengan el MISMO Código Postal
        voluntarios = Voluntario.objects.filter(cp=instance.cp, activo=True)
        print(f"🔍 [SIGNAL] Buscando voluntarios... Encontrados: {voluntarios.count()}")

        for v in voluntarios:
            print(f"📧 [SIGNAL] Intentando enviar mail a: {v.usuario.email}")
            # Enviamos el email al usuario voluntario
            send_mail(
                subject="¡Tienes un nuevo Match de Voluntariado!",
                message=(
                f"Hola {v.usuario.username},\n\n"
                f"Una persona en tu zona ({instance.cp}) necesita de tu ayuda como voluntario.\n\n"
                f"DATOS DE CONTACTO:\n"
                f"- Nombre: {instance.nombre_completo}\n"
                f"- Teléfono: {instance.telefono}\n"
                f"- Descripción: {instance.descripcion}\n\n"
                f"Por favor, ponte en contacto lo antes posible.\n"
                f"¡Gracias por tu compromiso!"
            ),
            from_email="no-reply@tudominio.com",
            recipient_list=[v.usuario.email],
            fail_silently=False,
        )

def procesar_seguimiento_ayuda():
    hace_una_semana = timezone.now() - timedelta(days=7)

    # Buscamos solicitudes de hace 7 días que no hayan sido procesadas
    pendientes = SolicitudAyuda.objects.filter(
        fecha_creacion__lte=hace_una_semana, encuesta_enviada=False
    )

    for solicitud in pendientes:
        if solicitud.es_persona_mayor:
            # Opción B: Marcar para llamada manual
            solicitud.requiere_llamada = True
            print(f"Generar alerta: Llamar a {solicitud.nombre_completo}")
        else:
            # Opción A: Enviar email automático
            enviar_email_encuesta(solicitud)
            solicitud.encuesta_enviada = True

        solicitud.save()
