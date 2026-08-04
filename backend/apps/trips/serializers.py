from datetime import date

from rest_framework import serializers

from apps.travel.models import Airport
from .models import Trip, ItineraryDay, Activity


class AirportMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = (
            "id",
            "name",
            "iata_code",
        )


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = (
            "id",
            "title",
            "location",
            "start_time",
            "end_time",
            "estimated_cost",
            "category",
            "priority",
            "notes",
        )


class ItineraryDaySerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = ItineraryDay
        fields = (
            "id",
            "day_number",
            "date",
            "title",
            "notes",
            "activities",
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

    days = ItineraryDaySerializer(
        many=True,
        read_only=True,
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
            "days",
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

        if source == destination:
            raise serializers.ValidationError(
                {
                    "destination_airport_id":
                    "Source and destination airports cannot be the same."
                }
            )

        if departure and departure < date.today():
            raise serializers.ValidationError(
                {
                    "departure_date":
                    "Departure date cannot be in the past."
                }
            )

        if return_date and departure and return_date < departure:
            raise serializers.ValidationError(
                {
                    "return_date":
                    "Return date cannot be earlier than departure date."
                }
            )

        if travelers is not None and travelers < 1:
            raise serializers.ValidationError(
                {
                    "travelers":
                    "At least one traveler is required."
                }
            )

        if budget is not None and budget < 0:
            raise serializers.ValidationError(
                {
                    "budget":
                    "Budget cannot be negative."
                }
            )

        return attrs