from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .activity_serializers import ActivitySerializer
from .models import Activity, ItineraryDay


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Activity.objects.filter(
                itinerary_day__trip__user=self.request.user
            )
            .select_related(
                "itinerary_day",
            )
        )

    def perform_create(self, serializer):
        itinerary_day = get_object_or_404(
            ItineraryDay,
            id=self.request.data.get("itinerary_day"),
            trip__user=self.request.user,
        )

        serializer.save(itinerary_day=itinerary_day)