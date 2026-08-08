from datetime import date

from rest_framework import serializers

from apps.travel.models import Airport
from apps.travel.serializers import AirportSerializer
from apps.flights.serializers import FlightSerializer
from apps.hotels.serializers import HotelSerializer

from .models import (
    Trip,
    ItineraryDay,
    Activity,
)


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity

        fields = (
            "id",
            "title",
            "description",
            "location",
            "city",
            "country",
            "transport",
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

    source_airport = AirportSerializer(
        read_only=True,
    )

    destination_airport = AirportSerializer(
        read_only=True,
    )

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

    selected_flight = FlightSerializer(
        read_only=True,
    )

    selected_hotel = HotelSerializer(
        read_only=True,
    )

    travelers = serializers.IntegerField(
        read_only=True,
    )

    class Meta:
        model = Trip

        fields = (
            "id",

            "title",
            "overview",

            "source_airport",
            "destination_airport",

            "source_airport_id",
            "destination_airport_id",

            "departure_date",
            "return_date",

            "adults",
            "children",
            "infants",
            "seniors",

            "travelers",

            "cabin_class",

            "budget",

            "status",

            "selected_flight",

            "selected_hotel",

            "notes",

            "days",

            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "travelers",
            "created_at",
            "updated_at",
        )

    days = ItineraryDaySerializer(
        many=True,
        read_only=True,
    )

    def validate(self, attrs):

        source = attrs.get(
            "source_airport",
            getattr(
                self.instance,
                "source_airport",
                None,
            ),
        )

        destination = attrs.get(
            "destination_airport",
            getattr(
                self.instance,
                "destination_airport",
                None,
            ),
        )

        departure = attrs.get(
            "departure_date",
            getattr(
                self.instance,
                "departure_date",
                None,
            ),
        )

        return_date = attrs.get(
            "return_date",
            getattr(
                self.instance,
                "return_date",
                None,
            ),
        )

        budget = attrs.get(
            "budget",
            getattr(
                self.instance,
                "budget",
                None,
            ),
        )

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

        if (
            departure
            and return_date
            and return_date < departure
        ):
            raise serializers.ValidationError(
                {
                    "return_date":
                    "Return date cannot be earlier than departure date."
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


class SaveLayoverTripSerializer(serializers.Serializer):

    planner = serializers.JSONField()

    result = serializers.JSONField()

from .models import LayoverTrip


class LayoverTripSerializer(serializers.ModelSerializer):

    class Meta:
        model = LayoverTrip

        fields = (
            "id",
            "user",

            "departure_airport",
            "layover_airport",
            "destination_airport",

            "arrival_date",
            "arrival_time",

            "departure_date",
            "departure_time",

            "budget",

            "travel_style",

            "ai_result",

            "created_at",
        )

        read_only_fields = (
            "id",
            "user",
            "created_at",
        )