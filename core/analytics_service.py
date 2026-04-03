from django.conf import settings
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, Dimension, Metric, DateRange
from google.analytics.data_v1beta.types import OrderBy

def get_google_analytics_data():
    creds = settings.GOOGLE_ANALYTICS_CREDENTIALS
    property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID
    

    # Si es un string, es una ruta (Local). Si es un dict, son los datos (Railway).
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

    formatted_data = []
    for row in response.rows:
        # Google da la fecha como "20260403"
        raw_date = row.dimension_values[0].value
        nice_date = f"{raw_date[6:8]}/{raw_date[4:6]}" # Queda como "03/04"
        
        formatted_data.append({
            "fecha": nice_date,
            "usuarios": int(row.metric_values[0].value)
        })

    # Ordenamos por fecha para que la gráfica no salga desordenada
    return sorted(formatted_data, key=lambda x: x['fecha'])

def get_conversion_data():
    creds = settings.GOOGLE_ANALYTICS_CREDENTIALS
    property_id = settings.GOOGLE_ANALYTICS_PROPERTY_ID
    client = BetaAnalyticsDataClient.from_service_account_json(creds) if isinstance(creds, str) else BetaAnalyticsDataClient.from_service_account_info(creds)

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
        'session_start': 'Visitas',
        'login': 'Logins',
        'view_item': 'Tienda',
        'purchase': 'Ventas'
    }

    conversion_stats = []
    for row in response.rows:
        name = row.dimension_values[0].value
        if name in event_mapping:
            conversion_stats.append({
                "nombre": event_mapping[name],
                "valor": int(row.metric_values[0].value)
            })
    return conversion_stats