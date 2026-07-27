from django.contrib import admin

from .models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "source_airport",
        "destination_airport",
        "departure_date",
        "status",
    )

    list_filter = (
        "status",
        "cabin_class",
    )

    search_fields = (
        "user__username",
        "source_airport__iata_code",
        "destination_airport__iata_code",
    )

    ordering = (
        "-created_at",
    )