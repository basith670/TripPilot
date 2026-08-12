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
    LayoverTrip,
)


# ==========================================================
# ACTIVITY
# ==========================================================

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


# ==========================================================
# ITINERARY DAY
# ==========================================================

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


# ==========================================================
# TRIP
# ==========================================================

class TripSerializer(serializers.ModelSerializer):

    # ------------------------------------------------------
    # AIRPORTS
    # ------------------------------------------------------

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

    # ------------------------------------------------------
    # SELECTED FLIGHT
    #
    # Keeps existing functionality.
    # ------------------------------------------------------

    selected_flight = FlightSerializer(
        read_only=True,
    )

    # ------------------------------------------------------
    # ALL FLIGHTS
    #
    # IMPORTANT:
    #
    # Trip model:
    #
    # flights = Flight.objects related_name
    #
    # This exposes BOTH:
    #
    # OUTBOUND
    # RETURN
    # ------------------------------------------------------

    flights = FlightSerializer(
        many=True,
        read_only=True,
    )

    # ------------------------------------------------------
    # SELECTED HOTEL
    # ------------------------------------------------------

    selected_hotel = HotelSerializer(
        read_only=True,
    )

    # ------------------------------------------------------
    # TRAVELERS
    # ------------------------------------------------------

    travelers = serializers.IntegerField(
        read_only=True,
    )

    # ------------------------------------------------------
    # DAYS
    # ------------------------------------------------------

    days = ItineraryDaySerializer(
        many=True,
        read_only=True,
    )

    class Meta:

        model = Trip

        fields = (
            # ------------------------------------------------
            # BASIC
            # ------------------------------------------------

            "id",

            "title",
            "overview",

            # ------------------------------------------------
            # AIRPORTS
            # ------------------------------------------------

            "source_airport",
            "destination_airport",

            "source_airport_id",
            "destination_airport_id",

            # ------------------------------------------------
            # DATES
            # ------------------------------------------------

            "departure_date",
            "return_date",

            # ------------------------------------------------
            # TRAVELERS
            # ------------------------------------------------

            "adults",
            "children",
            "infants",
            "seniors",

            "travelers",

            # ------------------------------------------------
            # CABIN
            # ------------------------------------------------

            "cabin_class",

            # ------------------------------------------------
            # BUDGET
            # ------------------------------------------------

            "budget",

            # ------------------------------------------------
            # STATUS
            # ------------------------------------------------

            "status",

            # ------------------------------------------------
            # FLIGHTS
            #
            # IMPORTANT:
            #
            # selected_flight
            #     → currently selected flight
            #
            # flights
            #     → ALL flights belonging to trip
            #
            # This allows frontend to display:
            #
            # OUTBOUND + RETURN
            # ------------------------------------------------

            "flights",

            "selected_flight",

            # ------------------------------------------------
            # HOTEL
            # ------------------------------------------------

            "selected_hotel",

            # ------------------------------------------------
            # NOTES
            # ------------------------------------------------

            "notes",

            # ------------------------------------------------
            # ITINERARY
            # ------------------------------------------------

            "days",

            # ------------------------------------------------
            # TIMESTAMPS
            # ------------------------------------------------

            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "travelers",
            "created_at",
            "updated_at",
        )

    # ======================================================
    # VALIDATION
    # ======================================================

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

        # --------------------------------------------------
        # SAME AIRPORT
        # --------------------------------------------------

        if (
            source is not None
            and destination is not None
            and source == destination
        ):

            raise serializers.ValidationError(
                {
                    "destination_airport_id":
                    "Source and destination airports cannot be the same."
                }
            )

        # --------------------------------------------------
        # PAST DEPARTURE
        # --------------------------------------------------

        if (
            departure
            and departure < date.today()
        ):

            raise serializers.ValidationError(
                {
                    "departure_date":
                    "Departure date cannot be in the past."
                }
            )

        # --------------------------------------------------
        # RETURN BEFORE DEPARTURE
        # --------------------------------------------------

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

        # --------------------------------------------------
        # NEGATIVE BUDGET
        # --------------------------------------------------

        if (
            budget is not None
            and budget < 0
        ):

            raise serializers.ValidationError(
                {
                    "budget":
                    "Budget cannot be negative."
                }
            )

        return attrs


# ==========================================================
# SAVE LAYOVER TRIP
# ==========================================================

class SaveLayoverTripSerializer(
    serializers.Serializer
):

    planner = serializers.JSONField()

    result = serializers.JSONField()


# ==========================================================
# LAYOVER TRIP
# ==========================================================

class LayoverTripSerializer(
    serializers.ModelSerializer
):

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