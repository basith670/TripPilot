from django.contrib import admin

from .models import (
    Trip,
    ItineraryDay,
    Activity,
)


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

@admin.register(ItineraryDay)
class ItineraryDayAdmin(admin.ModelAdmin):
    list_display = (
        "trip",
        "day_number",
        "date",
        "title",
    )

    search_fields = (
        "trip__user__username",
        "title",
    )

    list_filter = (
        "date",
    )

    ordering = (
        "trip",
        "day_number",
    )

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "itinerary_day",
        "start_time",
        "priority",
        "estimated_cost",
    )

    list_filter = (
        "priority",
    )

    search_fields = (
        "title",
        "location",
    )

    ordering = (
        "itinerary_day",
        "start_time",
    )