from django.conf import settings
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    Dimension,
    Metric,
    DateRange,
    OrderBy,
)
import re


def get_client():
    creds = settings.GOOGLE_ANALYTICS_CREDENTIALS
    # Si es un dict → Railway
    if isinstance(creds, dict):
        return BetaAnalyticsDataClient.from_service_account_info(creds)

    # Si es un string → ruta local
    return BetaAnalyticsDataClient.from_service_account_json(creds)


def get_google_analytics_data():
    """
    devuelve un diccionario con:
    - grafica_semanal: (fechas y usuarios)
    - total_historico: (El número acumulado para el KPI)
    - cp_mas_buscados: (El top 5 de CPs extraídos de las URLs)
    """
    try:
        client = get_client()
        property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID
        # petición gráfica semanal de usuarios activos por día
        request_semanal = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        response_semanal = client.run_report(request_semanal)

        temp_semanal = []
        if response_semanal.rows:
            for row in response_semanal.rows:
                raw_date = row.dimension_values[0].value
                nice_date = (
                    f"{raw_date[6:8]}/{raw_date[4:6]}"
                    if len(raw_date) >= 8
                    else raw_date
                )
                temp_semanal.append(
                    {
                        "raw": raw_date,
                        "fecha": nice_date,
                        "usuarios": int(row.metric_values[0].value),
                    }
                )
            temp_semanal.sort(key=lambda x: x["raw"])

        grafica_final = [
            {"fecha": d["fecha"], "usuarios": d["usuarios"]} for d in temp_semanal
        ]

        # total histórico de usuarios activos (desde el inicio hasta hoy)
        request_total = RunReportRequest(
            property=f"properties/{property_id}",
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date="2020-01-01", end_date="today")],
        )
        response_total = client.run_report(request_total)
        total_val = (
            int(response_total.rows[0].metric_values[0].value)
            if response_total.rows
            else 0
        )
        # petición para CP más buscados (Basado en URLs)
        request_cp = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="pagePath")],
            metrics=[Metric(name="screenPageViews")],
            date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        )
        response_cp = client.run_report(request_cp)

        temp_cp = []
        for row in response_cp.rows:
            match = re.search(r"(\d{5})", row.dimension_values[0].value)
            if match:
                temp_cp.append(
                    {"cp": match.group(1), "busquedas": int(row.metric_values[0].value)}
                )
        cp_final = sorted(temp_cp, key=lambda x: x["busquedas"], reverse=True)[:5]

        # devuelve todo agrupado
        return {
            "grafica_semanal": (
                grafica_final
                if grafica_final
                else [{"fecha": "Sin datos", "usuarios": 0}]
            ),
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


def get_conversion_data():
    """Mantiene exactamente tu lógica de eventos sin cambios"""
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

        return (
            conversion_stats
            if conversion_stats
            else [{"nombre": "Visitas", "valor": 0}, {"nombre": "Ventas", "valor": 0}]
        )
    except Exception as e:
        print(f"Error en Conversión: {e}")
        return [{"nombre": "Error", "valor": 0}]
