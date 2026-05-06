from django.conf import settings
from django.db.models.functions import TruncDate
from django.db.models import Count
from django.contrib.auth.models import User
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    Dimension,
    Metric,
    DateRange,
)
import re


def get_client():
    creds = settings.GOOGLE_ANALYTICS_CREDENTIALS
    if isinstance(creds, dict):
        return BetaAnalyticsDataClient.from_service_account_info(creds)
    return BetaAnalyticsDataClient.from_service_account_json(creds)


# ---------------------------------------------------------
# 1. Usuarios activos por día (BBDD)
# ---------------------------------------------------------
def get_usuarios_activos_semanal():
    datos = (
        User.objects.annotate(fecha=TruncDate("date_joined"))
        .values("fecha")
        .annotate(total=Count("id"))
        .order_by("fecha")
    )

    return [
        {"fecha": d["fecha"].strftime("%d/%m"), "usuarios": d["total"]} for d in datos
    ]


# ---------------------------------------------------------
# 2. Datos de visitas desde GA4
# ---------------------------------------------------------
def get_google_analytics_data():
    return {
        "grafica_semanal": [],
        "total_historico": 0,
        "cp_mas_buscados": [],
    }


# ---------------------------------------------------------
# 3. Conversiones
# ---------------------------------------------------------
def get_conversion_data():
    try:
        client = get_client()
        property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID

        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        response = client.run_report(request)

        event_mapping = {
            "session_start": "Visitas",
            "login": "Logins",
            "view_item": "Tienda",
            "purchase": "Ventas",
        }

        if not response or not response.rows:
            return [
                {"nombre": "Visitas", "valor": 0},
                {"nombre": "Ventas", "valor": 0},
                {"nombre": "Logins", "valor": 0},
                {"nombre": "Tienda", "valor": 0},
            ]

        conversion_stats = []
        for row in response.rows:
            name = row.dimension_values[0].value
            if name in event_mapping:
                conversion_stats.append(
                    {
                        "nombre": event_mapping[name],
                        "valor": int(row.metric_values[0].value),
                    }
                )

        return conversion_stats or [
            {"nombre": "Visitas", "valor": 0},
            {"nombre": "Ventas", "valor": 0},
        ]

    except Exception as e:
        print(f"Error en Conversión: {e}")
        return [{"nombre": "Error", "valor": 0}]
