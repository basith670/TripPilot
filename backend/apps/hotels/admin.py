from django.contrib import admin

from .models import Hotel


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "trip",
        "room_type",
        "check_in",
        "check_out",
        "price",
        "status",
    )

    list_filter = (
        "status",
        "room_type",
        "city",
        "country",
    )

    search_fields = (
        "name",
        "city",
        "country",
        "booking_reference",
    )

    ordering = (
        "-check_in",
    )