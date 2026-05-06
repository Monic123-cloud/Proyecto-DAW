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
    try:
        client = get_client()
        property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID

        # 1. Visitas últimos 7 días
        request_semanal = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="sessions")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        response_semanal = client.run_report(request_semanal)

        grafica_final = []
        for row in response_semanal.rows:
            raw_date = row.dimension_values[0].value
            nice_date = f"{raw_date[6:8]}/{raw_date[4:6]}"
            grafica_final.append(
                {
                    "fecha": nice_date,
                    "usuarios": int(row.metric_values[0].value),
                }
            )

        # 2. Total histórico de visitas
        request_total = RunReportRequest(
            property=f"properties/{property_id}",
            metrics=[Metric(name="sessions")],
            date_ranges=[DateRange(start_date="2020-01-01", end_date="today")],
        )
        response_total = client.run_report(request_total)
        total_val = (
            int(response_total.rows[0].metric_values[0].value)
            if response_total.rows
            else 0
        )

        # 3. CP más buscados (page views)
        request_cp = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="pagePath")],
            metrics=[Metric(name="views")],
            date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        )
        response_cp = client.run_report(request_cp)

        temp_cp = []
        for row in response_cp.rows:
            match = re.search(r"(\d{5})", row.dimension_values[0].value)
            if match:
                temp_cp.append(
                    {
                        "cp": match.group(1),
                        "busquedas": int(row.metric_values[0].value),
                    }
                )

        cp_final = sorted(temp_cp, key=lambda x: x["busquedas"], reverse=True)[:5]

        return {
            "grafica_semanal": grafica_final or [{"fecha": "Sin datos", "usuarios": 0}],
            "total_historico": total_val,
            "cp_mas_buscados": cp_final,
        }

    except Exception as e:
        print(f"Error crítico en get_google_analytics_data: {e}")
        return {
            "grafica_semanal": [{"fecha": "Error API", "usuarios": 0}],
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
