from django.db.models import Sum

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Activity, Trip
from .serializers import TripSerializer
from .services import save_ai_itinerary


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Trip.objects.filter(user=self.request.user)
            .select_related(
                "source_airport",
                "destination_airport",
            )
            .prefetch_related(
                "days__activities",
            )
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=True,
        methods=["post"],
        url_path="save-ai-itinerary",
    )
    def save_ai_itinerary_action(self, request, pk=None):
        trip = self.get_object()

        itinerary = request.data.get("days")

        if not itinerary:
            return Response(
                {
                    "success": False,
                    "message": "No itinerary data received.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        save_ai_itinerary(
            trip=trip,
            itinerary_days=itinerary,
        )

        return Response(
            {
                "success": True,
                "message": "AI itinerary saved successfully.",
            }
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="budget-summary",
    )
    def budget_summary(self, request, pk=None):
        trip = self.get_object()

        activities = Activity.objects.filter(
            itinerary_day__trip=trip
        )

        # -------------------------------------------------
        # Overall Totals
        # -------------------------------------------------

        total_cost = (
            activities.aggregate(
                total=Sum("estimated_cost")
            )["total"]
            or 0
        )

        total_cost = float(total_cost)

        total_activities = activities.count()

        budget = float(trip.budget or 0)

        remaining_budget = max(
            budget - total_cost,
            0,
        )

        budget_used_percentage = (
            (total_cost / budget) * 100
            if budget > 0
            else 0
        )

        # -------------------------------------------------
        # Cost by Day
        # -------------------------------------------------

        day_queryset = (
            activities.values(
                "itinerary_day__day_number",
            )
            .annotate(
                cost=Sum("estimated_cost"),
            )
            .order_by(
                "itinerary_day__day_number",
            )
        )

        cost_by_day = [
            {
                "day": row["itinerary_day__day_number"],
                "cost": float(row["cost"] or 0),
            }
            for row in day_queryset
        ]

        # -------------------------------------------------
        # Cost by Priority
        # -------------------------------------------------

        priority_queryset = (
            activities.values(
                "priority",
            )
            .annotate(
                cost=Sum("estimated_cost"),
            )
        )

        cost_by_priority = {
            "HIGH": 0,
            "MEDIUM": 0,
            "LOW": 0,
        }

        for row in priority_queryset:
            priority = row["priority"]

            if priority in cost_by_priority:
                cost_by_priority[priority] = float(
                    row["cost"] or 0
                )

        # -------------------------------------------------
        # Budget Status
        # -------------------------------------------------

        if budget == 0:
            budget_status = "NO_BUDGET"
            budget_message = (
                "No budget has been set for this trip."
            )

        elif total_cost > budget:
            budget_status = "OVER_BUDGET"
            budget_message = (
                f"You are over budget by ₹{total_cost - budget:,.0f}."
            )

        elif budget_used_percentage >= 90:
            budget_status = "CRITICAL"
            budget_message = (
                "You have used more than 90% of your budget."
            )

        elif budget_used_percentage >= 70:
            budget_status = "WARNING"
            budget_message = (
                "You have used more than 70% of your budget."
            )

        else:
            budget_status = "SAFE"
            budget_message = (
                f"You still have ₹{remaining_budget:,.0f} remaining."
            )

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return Response(
            {
                "budget": budget,
                "total_cost": total_cost,
                "remaining_budget": remaining_budget,
                "budget_used_percentage": round(
                    budget_used_percentage,
                    2,
                ),
                "total_activities": total_activities,
                "cost_by_day": cost_by_day,
                "cost_by_priority": cost_by_priority,

                # Budget Alert
                "status": budget_status,
                "message": budget_message,
            }
        )