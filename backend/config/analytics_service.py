from django.conf import settings
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    Dimension,
    Metric,
    DateRange,
)
from google.analytics.data_v1beta.types import OrderBy


def get_google_analytics_data():
    try:
        creds = settings.GOOGLE_ANALYTICS_CREDENTIALS
        property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID

        # Inicialización del cliente
        if isinstance(creds, str):
            client = BetaAnalyticsDataClient.from_service_account_json(creds)
        else:
            client = BetaAnalyticsDataClient.from_service_account_info(creds)

        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )

        response = client.run_report(request)

        # Validar si hay filas para evitar errores de iteración
        if not response or not response.rows:
            return [{"fecha": "Sin datos", "usuarios": 0}]

        temp_data = []
        for row in response.rows:
            raw_date = row.dimension_values[0].value  # Formato: "20260503"
            
            # Formateo visual (DD/MM)
            if len(raw_date) >= 8:
                nice_date = f"{raw_date[6:8]}/{raw_date[4:6]}"
            else:
                nice_date = raw_date

            # Guardamos la fecha original para ordenar correctamente
            temp_data.append({
                "raw": raw_date, 
                "fecha": nice_date, 
                "usuarios": int(row.metric_values[0].value)
            })

        # ORDENACIÓN CRONOLÓGICA: Usamos el valor original (20260430 < 20260501)
        temp_data.sort(key=lambda x: x["raw"])

        # Devolvemos solo la estructura que tu frontend ya conoce
        return [{"fecha": d["fecha"], "usuarios": d["usuarios"]} for d in temp_data]

    except Exception as e:
        # Esto evita el Error 500 en el frontend
        print(f"Error crítico en Analytics: {e}")
        return [{"fecha": "Error API", "usuarios": 0}]


def get_conversion_data():
    creds = settings.GOOGLE_ANALYTICS_CREDENTIALS
    property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID
    client = (
        BetaAnalyticsDataClient.from_service_account_json(creds)
        if isinstance(creds, str)
        else BetaAnalyticsDataClient.from_service_account_info(creds)
    )

    # Aquí pedimos "eventName" (nombre del evento) en lugar de "date" (fecha)
    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name="eventName")],
        metrics=[Metric(name="eventCount")],
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
    )
    response = client.run_report(request)

    # Diccionario para "traducir" los nombres técnicos de Google
    event_mapping = {
        "session_start": "Visitas",
        "login": "Logins",
        "view_item": "Tienda",
        "purchase": "Ventas",
    }

    if not response.rows:
        return [{"nombre": "Visitas", "valor": 0}, {"nombre": "Ventas", "valor": 0}]

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
