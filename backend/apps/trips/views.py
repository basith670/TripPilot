from django.db.models import Sum

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.flights.models import Flight
from apps.hotels.models import Hotel

from .models import Activity, Trip, LayoverTrip
from .serializers import (
    TripSerializer,
    SaveLayoverTripSerializer,
    LayoverTripSerializer,
)
from .services import save_ai_itinerary
from .trip_services.save_generated_trip import save_generated_trip


class TripViewSet(viewsets.ModelViewSet):

    serializer_class = TripSerializer

    permission_classes = [IsAuthenticated]

    # ==========================================================
    # QUERYSET
    # ==========================================================

    def get_queryset(self):

        return (
            Trip.objects
            .filter(
                user=self.request.user
            )
            .select_related(
                "source_airport",
                "destination_airport",
                "selected_flight__airline",
                "selected_hotel",
            )
            .prefetch_related(
                "days",
                "days__activities",
                "flights",
                "hotels",
            )
        )

    # ==========================================================
    # CREATE TRIP
    # ==========================================================

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )

    # ==========================================================
    # SAVE GENERATED TRIP
    # ==========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="save-generated-trip",
    )
    def save_generated_trip_action(self, request):

        # ------------------------------------------------------
        # GET REQUEST DATA
        # ------------------------------------------------------

        planner = request.data.get("planner")

        ai_trip = request.data.get("trip")

        # ------------------------------------------------------
        # VALIDATE REQUEST
        # ------------------------------------------------------

        if not planner or not ai_trip:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Planner data and AI trip "
                        "are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ------------------------------------------------------
        # VALIDATE REQUIRED PLANNER FIELDS
        # ------------------------------------------------------

        required_planner_fields = [
            "source_airport",
            "destination_airport",
            "cabin_class",
        ]

        missing_fields = [
            field
            for field in required_planner_fields
            if not planner.get(field)
        ]

        if missing_fields:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Missing required planner fields."
                    ),
                    "missing_fields": missing_fields,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ------------------------------------------------------
        # VALIDATE FLIGHT OBJECT
        #
        # TripPlannerService already generated:
        #
        # flight = {
        #     outbound: {...},
        #     return: {...},
        #     total_price: ...,
        #     reason: ...
        # }
        #
        # DO NOT generate another flight here.
        # ------------------------------------------------------

        flight_data = ai_trip.get("flight")

        if flight_data:

            outbound_flight = flight_data.get(
                "outbound"
            )

            return_flight = flight_data.get(
                "return"
            )

            # --------------------------------------------------
            # OUTBOUND FLIGHT VALIDATION
            # --------------------------------------------------

            if outbound_flight is None:

                return Response(
                    {
                        "success": False,
                        "message": (
                            "Outbound flight "
                            "could not be generated."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # --------------------------------------------------
            # RETURN FLIGHT IS OPTIONAL
            #
            # One-way trips legitimately have:
            #
            # return = None
            #
            # Round trips should contain:
            #
            # return = {...}
            # --------------------------------------------------

            return_date = planner.get(
                "return_date"
            )

            if return_date and return_flight is None:

                return Response(
                    {
                        "success": False,
                        "message": (
                            "A return date was provided, "
                            "but the return flight "
                            "could not be generated."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # --------------------------------------------------
            # DEBUG INFORMATION
            # --------------------------------------------------

            print(
                "=========================================="
            )

            print(
                "SAVE GENERATED TRIP"
            )

            print(
                "Outbound flight:",
                outbound_flight.get(
                    "flight_number"
                ),
            )

            print(
                "Return flight:",
                (
                    return_flight.get(
                        "flight_number"
                    )
                    if return_flight
                    else "None"
                ),
            )

            print(
                "Total flight price:",
                flight_data.get(
                    "total_price",
                    0,
                ),
            )

            print(
                "=========================================="
            )

        else:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Flight data is missing "
                        "from the generated trip."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ======================================================
        # SAVE GENERATED TRIP
        #
        # IMPORTANT:
        #
        # The complete AI-generated trip is passed through
        # unchanged.
        #
        # save_generated_trip() is responsible for creating
        # the database records.
        # ======================================================

        trip = save_generated_trip(
            user=request.user,
            planner=planner,
            ai_trip=ai_trip,
        )

        # ======================================================
        # SERIALIZE
        # ======================================================

        serializer = self.get_serializer(
            trip
        )

        # ======================================================
        # RESPONSE
        # ======================================================

        return Response(
            {
                "success": True,
                "message": (
                    "Trip created successfully."
                ),
                "trip": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    # ==========================================================
    # SELECT FLIGHT
    # ==========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="select-flight",
    )
    def select_flight(
        self,
        request,
        pk=None,
    ):

        trip = self.get_object()

        flight_id = request.data.get(
            "flight_id"
        )

        if not flight_id:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Flight ID is required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            flight = Flight.objects.get(
                id=flight_id,
                trip=trip,
            )

        except Flight.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Flight not found "
                        "for this trip."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        trip.selected_flight = flight

        trip.save(
            update_fields=[
                "selected_flight"
            ]
        )

        serializer = self.get_serializer(
            trip
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Flight selected successfully."
                ),
                "trip": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # ==========================================================
    # SELECT HOTEL
    # ==========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="select-hotel",
    )
    def select_hotel(
        self,
        request,
        pk=None,
    ):

        trip = self.get_object()

        hotel_id = request.data.get(
            "hotel_id"
        )

        if not hotel_id:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Hotel ID is required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            hotel = Hotel.objects.get(
                id=hotel_id,
                trip=trip,
            )

        except Hotel.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Hotel not found "
                        "for this trip."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        trip.selected_hotel = hotel

        trip.save(
            update_fields=[
                "selected_hotel"
            ]
        )

        serializer = self.get_serializer(
            trip
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Hotel selected successfully."
                ),
                "trip": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # ==========================================================
    # SAVE AI ITINERARY
    # ==========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="save-ai-itinerary",
    )
    def save_ai_itinerary_action(
        self,
        request,
        pk=None,
    ):

        trip = self.get_object()

        itinerary = request.data.get(
            "days"
        )

        if not itinerary:

            return Response(
                {
                    "success": False,
                    "message": (
                        "No itinerary data received."
                    ),
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
                "message": (
                    "AI itinerary saved successfully."
                ),
            },
            status=status.HTTP_200_OK,
        )

    # ==========================================================
    # BUDGET SUMMARY
    # ==========================================================

    @action(
        detail=True,
        methods=["get"],
        url_path="budget-summary",
    )
    def budget_summary(
        self,
        request,
        pk=None,
    ):

        trip = self.get_object()

        activities = Activity.objects.filter(
            itinerary_day__trip=trip
        )

        # ------------------------------------------------------
        # OVERALL TOTALS
        # ------------------------------------------------------

        total_cost = (
            activities
            .aggregate(
                total=Sum(
                    "estimated_cost"
                )
            )
            .get("total")
            or 0
        )

        total_cost = float(
            total_cost
        )

        total_activities = (
            activities.count()
        )

        budget = float(
            trip.budget or 0
        )

        remaining_budget = max(
            budget - total_cost,
            0,
        )

        budget_used_percentage = (
            (total_cost / budget) * 100
            if budget > 0
            else 0
        )

        # ------------------------------------------------------
        # COST BY DAY
        # ------------------------------------------------------

        day_queryset = (
            activities
            .values(
                "itinerary_day__day_number"
            )
            .annotate(
                cost=Sum(
                    "estimated_cost"
                )
            )
            .order_by(
                "itinerary_day__day_number"
            )
        )

        cost_by_day = [
            {
                "day": row[
                    "itinerary_day__day_number"
                ],
                "cost": float(
                    row["cost"] or 0
                ),
            }
            for row in day_queryset
        ]

        # ------------------------------------------------------
        # COST BY PRIORITY
        # ------------------------------------------------------

        priority_queryset = (
            activities
            .values(
                "priority"
            )
            .annotate(
                cost=Sum(
                    "estimated_cost"
                )
            )
        )

        cost_by_priority = {
            "HIGH": 0,
            "MEDIUM": 0,
            "LOW": 0,
        }

        for row in priority_queryset:

            priority = row[
                "priority"
            ]

            if priority in cost_by_priority:

                cost_by_priority[
                    priority
                ] = float(
                    row["cost"] or 0
                )

        # ------------------------------------------------------
        # BUDGET STATUS
        # ------------------------------------------------------

        if budget == 0:

            budget_status = (
                "NO_BUDGET"
            )

            budget_message = (
                "No budget has been set "
                "for this trip."
            )

        elif total_cost > budget:

            budget_status = (
                "OVER_BUDGET"
            )

            budget_message = (
                f"You are over budget "
                f"by ₹{total_cost - budget:,.0f}."
            )

        elif budget_used_percentage >= 90:

            budget_status = (
                "CRITICAL"
            )

            budget_message = (
                "You have used more than "
                "90% of your budget."
            )

        elif budget_used_percentage >= 70:

            budget_status = (
                "WARNING"
            )

            budget_message = (
                "You have used more than "
                "70% of your budget."
            )

        else:

            budget_status = (
                "SAFE"
            )

            budget_message = (
                f"You still have "
                f"₹{remaining_budget:,.0f} remaining."
            )

        # ------------------------------------------------------
        # RESPONSE
        # ------------------------------------------------------

        return Response(
            {
                "budget": budget,
                "total_cost": total_cost,
                "remaining_budget": (
                    remaining_budget
                ),
                "budget_used_percentage": round(
                    budget_used_percentage,
                    2,
                ),
                "total_activities": (
                    total_activities
                ),
                "cost_by_day": (
                    cost_by_day
                ),
                "cost_by_priority": (
                    cost_by_priority
                ),
                "status": budget_status,
                "message": budget_message,
            },
            status=status.HTTP_200_OK,
        )

    # ==========================================================
    # DASHBOARD
    # ==========================================================

    @action(
        detail=True,
        methods=["get"],
        url_path="dashboard",
    )
    def dashboard(
        self,
        request,
        pk=None,
    ):

        trip = self.get_object()

        serializer = self.get_serializer(
            trip
        )

        return Response(
            {
                "success": True,
                "trip": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # ==========================================================
    # RECENT TRIPS
    # ==========================================================

    @action(
        detail=False,
        methods=["get"],
        url_path="recent",
    )
    def recent(
        self,
        request,
    ):

        trips = self.get_queryset()[:5]

        serializer = self.get_serializer(
            trips,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# ==============================================================
# SAVE LAYOVER TRIP
# ==============================================================

class SaveLayoverTripAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
    ):

        serializer = SaveLayoverTripSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        planner = (
            serializer.validated_data[
                "planner"
            ]
        )

        result = (
            serializer.validated_data[
                "result"
            ]
        )

        trip = LayoverTrip.objects.create(
            user=request.user,
            departure_airport=(
                planner[
                    "departureAirport"
                ]
            ),
            layover_airport=(
                planner[
                    "layoverAirport"
                ]
            ),
            destination_airport=(
                planner[
                    "destinationAirport"
                ]
            ),
            arrival_date=(
                planner[
                    "arrivalDate"
                ]
            ),
            arrival_time=(
                planner[
                    "arrivalTime"
                ]
            ),
            departure_date=(
                planner[
                    "departureDate"
                ]
            ),
            departure_time=(
                planner[
                    "departureTime"
                ]
            ),
            budget=(
                planner[
                    "budget"
                ]
            ),
            travel_style=(
                planner[
                    "travelStyle"
                ]
            ),
            ai_result=result,
        )

        return Response(
            {
                "success": True,
                "id": trip.id,
                "message": (
                    "Layover trip saved "
                    "successfully."
                ),
            },
            status=status.HTTP_201_CREATED,
        )


# ==============================================================
# LAYOVER TRIP VIEWSET
# ==============================================================

class LayoverTripViewSet(
    viewsets.ModelViewSet
):

    serializer_class = (
        LayoverTripSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return (
            LayoverTrip.objects
            .filter(
                user=self.request.user
            )
            .order_by(
                "-created_at"
            )
        )