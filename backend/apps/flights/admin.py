from django.contrib import admin

from .models import Airline, Flight


@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
    )

    search_fields = (
        "name",
        "code",
    )


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = (
        "flight_number",
        "airline",
        "flight_type",
        "source_airport",
        "destination_airport",
        "departure_datetime",
        "price",
        "status",
    )

    list_filter = (
        "airline",
        "flight_type",
        "status",
        "cabin_class",
    )

    search_fields = (
        "flight_number",
        "booking_reference",
    )

    autocomplete_fields = (
        "trip",
        "airline",
        "source_airport",
        "destination_airport",
    )