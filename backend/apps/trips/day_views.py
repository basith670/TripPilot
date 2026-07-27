from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import ItineraryDay, Trip
from .day_serializers import ItineraryDaySerializer


class ItineraryDayViewSet(viewsets.ModelViewSet):
    serializer_class = ItineraryDaySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItineraryDay.objects.filter(
            trip__user=self.request.user
        ).select_related("trip")

    def perform_create(self, serializer):
        trip_id = self.request.data.get("trip")

        trip = Trip.objects.get(
            id=trip_id,
            user=self.request.user,
        )

        serializer.save(trip=trip)