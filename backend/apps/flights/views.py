from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Airline, Flight
from .serializers import (
    AirlineSerializer,
    FlightSerializer,
)


class AirlineViewSet(viewsets.ModelViewSet):
    """
    Airline CRUD API.
    (You can switch this back to ReadOnlyModelViewSet later
    once you've seeded your airlines.)
    """

    queryset = Airline.objects.all().order_by("name")
    serializer_class = AirlineSerializer
    permission_classes = [IsAuthenticated]


class FlightViewSet(viewsets.ModelViewSet):
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Flight.objects.filter(
                trip__user=self.request.user
            )
            .select_related(
                "trip",
                "airline",
                "source_airport",
                "destination_airport",
            )
            .order_by("departure_datetime")
        )

        trip_id = self.request.query_params.get("trip")

        if trip_id:
            queryset = queryset.filter(
                trip_id=trip_id
            )

        flight_type = self.request.query_params.get(
            "flight_type"
        )

        if flight_type:
            queryset = queryset.filter(
                flight_type=flight_type
            )

        status = self.request.query_params.get(
            "status"
        )

        if status:
            queryset = queryset.filter(
                status=status
            )

        return queryset