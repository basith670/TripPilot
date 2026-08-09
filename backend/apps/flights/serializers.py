from rest_framework import serializers

from .models import Airline, Flight


class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = "__all__"


class FlightSerializer(serializers.ModelSerializer):

    airline_name = serializers.CharField(
        source="airline.name",
        read_only=True,
    )

    airline_code = serializers.CharField(
        source="airline.code",
        read_only=True,
    )

    airline_logo = serializers.URLField(
        source="airline.logo",
        read_only=True,
    )

    source_airport_name = serializers.CharField(
        source="source_airport.name",
        read_only=True,
    )

    destination_airport_name = serializers.CharField(
        source="destination_airport.name",
        read_only=True,
    )

    source_iata = serializers.CharField(
        source="source_airport.iata_code",
        read_only=True,
    )

    destination_iata = serializers.CharField(
        source="destination_airport.iata_code",
        read_only=True,
    )

    cabin_class_display = serializers.CharField(
        source="get_cabin_class_display",
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    departure_terminal = serializers.CharField(
        source="terminal",
        read_only=True,
    )

    arrival_terminal = serializers.SerializerMethodField()

    duration_display = serializers.SerializerMethodField()

    class Meta:
        model = Flight

        fields = [
            "id",
            "trip",

            "airline",
            "airline_name",
            "airline_code",
            "airline_logo",

            "flight_type",
            "flight_number",

            "source_airport",
            "destination_airport",

            "source_airport_name",
            "destination_airport_name",

            "source_iata",
            "destination_iata",

            "departure_datetime",
            "arrival_datetime",

            "departure_terminal",
            "arrival_terminal",

            "duration_minutes",
            "duration_display",

            "cabin_class",
            "cabin_class_display",

            "price",

            "stops",

            "baggage_allowance",

            "refundable",

            "aircraft",

            "terminal",

            "gate",

            "booking_reference",

            "status",
            "status_display",

            "created_at",
            "updated_at",
        ]

        read_only_fields = (
            "duration_minutes",
            "created_at",
            "updated_at",
        )

    def get_duration_display(self, obj):
        hours = obj.duration_minutes // 60
        minutes = obj.duration_minutes % 60

        if hours:
            return f"{hours}h {minutes}m"

        return f"{minutes}m"

    def get_arrival_terminal(self, obj):
        """
        Reserved for future support.
        Current model stores only one terminal.
        """
        return ""

    def validate(self, attrs):
        departure = attrs.get(
            "departure_datetime",
            getattr(
                self.instance,
                "departure_datetime",
                None,
            ),
        )

        arrival = attrs.get(
            "arrival_datetime",
            getattr(
                self.instance,
                "arrival_datetime",
                None,
            ),
        )

        if departure and arrival and arrival <= departure:
            raise serializers.ValidationError(
                {
                    "arrival_datetime":
                    "Arrival time must be after departure time."
                }
            )

        return attrs

    def create(self, validated_data):
        departure = validated_data["departure_datetime"]
        arrival = validated_data["arrival_datetime"]

        validated_data["duration_minutes"] = int(
            (arrival - departure).total_seconds() / 60
        )

        return super().create(validated_data)

    def update(self, instance, validated_data):
        departure = validated_data.get(
            "departure_datetime",
            instance.departure_datetime,
        )

        arrival = validated_data.get(
            "arrival_datetime",
            instance.arrival_datetime,
        )

        validated_data["duration_minutes"] = int(
            (arrival - departure).total_seconds() / 60
        )

        return super().update(
            instance,
            validated_data,
        )