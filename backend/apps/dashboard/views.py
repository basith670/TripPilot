from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trips.models import (
    Trip,
    ItineraryDay,
    Activity,
)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trips = Trip.objects.filter(user=request.user)

        trip_ids = trips.values_list("id", flat=True)

        total_days = ItineraryDay.objects.filter(
            trip_id__in=trip_ids
        ).count()

        total_activities = Activity.objects.filter(
            itinerary_day__trip_id__in=trip_ids
        ).count()

        stats = trips.aggregate(
            total_trips=Count("id"),
            planning_trips=Count(
                "id",
                filter=Q(status=Trip.TripStatus.PLANNING),
            ),
            confirmed_trips=Count(
                "id",
                filter=Q(status=Trip.TripStatus.CONFIRMED),
            ),
            completed_trips=Count(
                "id",
                filter=Q(status=Trip.TripStatus.COMPLETED),
            ),
            cancelled_trips=Count(
                "id",
                filter=Q(status=Trip.TripStatus.CANCELLED),
            ),
            total_budget=Sum("budget"),
        )

        next_trip = (
            trips.filter(
                departure_date__gte=timezone.now().date(),
            )
            .select_related("destination_airport")
            .order_by("departure_date")
            .first()
        )

        recent_trips = (
            trips.select_related(
                "source_airport",
                "destination_airport",
            )
            .order_by("-created_at")[:5]
        )

        monthly_trips = (
            trips.annotate(
                month=TruncMonth("departure_date")
            )
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )

        return Response(
            {
                "statistics": {
                    "total_trips": stats["total_trips"] or 0,
                    "planning_trips": stats["planning_trips"] or 0,
                    "confirmed_trips": stats["confirmed_trips"] or 0,
                    "completed_trips": stats["completed_trips"] or 0,
                    "cancelled_trips": stats["cancelled_trips"] or 0,
                    "total_budget": stats["total_budget"] or 0,
                    "total_days": total_days,
                    "total_activities": total_activities,
                },
                "next_trip": (
                    {
                        "id": next_trip.id,
                        "destination": next_trip.destination_airport.name,
                        "iata_code": next_trip.destination_airport.iata_code,
                        "departure_date": next_trip.departure_date,
                    }
                    if next_trip
                    else None
                ),
                "recent_trips": [
                    {
                        "id": trip.id,
                        "from": trip.source_airport.iata_code,
                        "to": trip.destination_airport.iata_code,
                        "departure_date": trip.departure_date,
                        "status": trip.status,
                        "budget": trip.budget,
                    }
                    for trip in recent_trips
                ],
                "monthly_trips": [
                    {
                        "month": item["month"].strftime("%b %Y"),
                        "total": item["total"],
                    }
                    for item in monthly_trips
                ],
            }
        )