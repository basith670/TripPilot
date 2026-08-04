from copy import copy
from datetime import timedelta

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ItineraryDay, Trip
from .day_serializers import ItineraryDaySerializer


class ItineraryDayViewSet(viewsets.ModelViewSet):
    serializer_class = ItineraryDaySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            ItineraryDay.objects.filter(
                trip__user=self.request.user
            )
            .select_related("trip")
            .prefetch_related("activities")
        )

    def perform_create(self, serializer):
        trip_id = self.request.data.get("trip")

        trip = Trip.objects.get(
            id=trip_id,
            user=self.request.user,
        )

        serializer.save(trip=trip)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a day and automatically
        renumber the remaining itinerary.
        """

        day = self.get_object()
        trip = day.trip

        deleted_day = day.day_number
        activity_count = day.activities.count()

        day.delete()

        remaining_days = (
            trip.days.order_by("day_number")
        )

        for index, itinerary_day in enumerate(
            remaining_days,
            start=1,
        ):
            itinerary_day.day_number = index

            itinerary_day.date = (
                trip.departure_date
                + timedelta(days=index - 1)
            )

            itinerary_day.save(
                update_fields=[
                    "day_number",
                    "date",
                ]
            )

        return Response(
            {
                "success": True,
                "message": f"Day {deleted_day} deleted successfully.",
                "deleted_activities": activity_count,
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="duplicate",
    )
    def duplicate(self, request, pk=None):
        """
        Duplicate a day immediately after the
        selected day and renumber remaining days.
        """

        day = self.get_object()
        trip = day.trip

        insert_position = day.day_number + 1

        # Shift all following days down
        remaining_days = (
            trip.days.filter(
                day_number__gte=insert_position
            )
            .order_by("-day_number")
        )

        for itinerary_day in remaining_days:
            itinerary_day.day_number += 1

            itinerary_day.date = (
                trip.departure_date
                + timedelta(
                    days=itinerary_day.day_number - 1
                )
            )

            itinerary_day.save(
                update_fields=[
                    "day_number",
                    "date",
                ]
            )

        # Create copied day
        new_day = ItineraryDay.objects.create(
            trip=trip,
            day_number=insert_position,
            date=trip.departure_date
            + timedelta(days=insert_position - 1),
            title=f"{day.title} (Copy)",
            notes=day.notes,
        )

        # Duplicate activities
        for activity in day.activities.all():
            cloned = copy(activity)
            cloned.pk = None
            cloned.itinerary_day = new_day
            cloned.save()

        # Recalculate dates for every day
        for itinerary_day in trip.days.order_by(
            "day_number"
        ):
            itinerary_day.date = (
                trip.departure_date
                + timedelta(
                    days=itinerary_day.day_number - 1
                )
            )

            itinerary_day.save(
                update_fields=["date"]
            )

        serializer = self.get_serializer(new_day)

        return Response(
            {
                "success": True,
                "message": "Day duplicated successfully.",
                "day": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )