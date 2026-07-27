from datetime import date

from rest_framework import serializers

from apps.travel.models import Airport
from .models import Trip


class AirportMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = (
            "id",
            "name",
            "iata_code",
        )


class TripSerializer(serializers.ModelSerializer):
    source_airport = AirportMiniSerializer(read_only=True)
    destination_airport = AirportMiniSerializer(read_only=True)

    source_airport_id = serializers.PrimaryKeyRelatedField(
        queryset=Airport.objects.all(),
        source="source_airport",
        write_only=True,
    )

    destination_airport_id = serializers.PrimaryKeyRelatedField(
        queryset=Airport.objects.all(),
        source="destination_airport",
        write_only=True,
    )

    class Meta:
        model = Trip
        fields = (
            "id",
            "source_airport",
            "destination_airport",
            "source_airport_id",
            "destination_airport_id",
            "departure_date",
            "return_date",
            "travelers",
            "cabin_class",
            "budget",
            "status",
            "notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        source = attrs.get("source_airport")
        destination = attrs.get("destination_airport")
        departure = attrs.get("departure_date")
        return_date = attrs.get("return_date")
        travelers = attrs.get("travelers")
        budget = attrs.get("budget")

        # Source and destination cannot be the same
        if source == destination:
            raise serializers.ValidationError(
                {
                    "destination_airport_id": (
                        "Source and destination airports cannot be the same."
                    )
                }
            )

        # Departure date cannot be in the past
        if departure and departure < date.today():
            raise serializers.ValidationError(
                {
                    "departure_date": (
                        "Departure date cannot be in the past."
                    )
                }
            )

        # Return date must be after departure
        if (
            departure
            and return_date
            and return_date < departure
        ):
            raise serializers.ValidationError(
                {
                    "return_date": (
                        "Return date cannot be earlier than departure date."
                    )
                }
            )

        # At least one traveler
        if travelers is not None and travelers < 1:
            raise serializers.ValidationError(
                {
                    "travelers": (
                        "At least one traveler is required."
                    )
                }
            )

        # Budget cannot be negative
        if budget is not None and budget < 0:
            raise serializers.ValidationError(
                {
                    "budget": (
                        "Budget cannot be negative."
                    )
                }
            )

        return attrs