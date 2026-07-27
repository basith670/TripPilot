from django.db.models import Count, Sum, Q
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trips.models import Trip


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trips = Trip.objects.filter(user=request.user)

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

        return Response(
            {
                "statistics": {
                    "total_trips": stats["total_trips"] or 0,
                    "planning_trips": stats["planning_trips"] or 0,
                    "confirmed_trips": stats["confirmed_trips"] or 0,
                    "completed_trips": stats["completed_trips"] or 0,
                    "cancelled_trips": stats["cancelled_trips"] or 0,
                    "total_budget": stats["total_budget"] or 0,
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
            }
        )