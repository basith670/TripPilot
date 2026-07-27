from django.contrib import admin

from .models import Country, City, Airport


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "currency",
        "timezone",
        "is_active",
    )

    search_fields = (
        "name",
        "code",
    )

    list_filter = (
        "is_active",
    )


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "country",
        "state",
        "is_active",
    )

    search_fields = (
        "name",
        "state",
    )

    list_filter = (
        "country",
        "is_active",
    )

    ordering = (
        "country",
        "name",
    )

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = (
        "iata_code",
        "name",
        "city",
        "is_international",
        "is_active",
    )

    search_fields = (
        "iata_code",
        "icao_code",
        "name",
    )

    list_filter = (
        "is_international",
        "is_active",
        "city",
    )

    ordering = (
        "iata_code",
    )