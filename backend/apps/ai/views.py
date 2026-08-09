from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    GenerateItinerarySerializer,
    GenerateTripSerializer,
    LayoverPlannerSerializer,
)

from .itinerary_service import AIItineraryService
from .services.trip_planner_service import TripPlannerService
from .services.layover_service import LayoverAIService


class GenerateItineraryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateItinerarySerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        result = AIItineraryService.generate(
            destination=serializer.validated_data["destination"],
            days=serializer.validated_data["days"],
            budget=serializer.validated_data["budget"],
            travel_style=serializer.validated_data["travel_style"],
        )

        return Response(result)


class GenerateTripView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateTripSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True,
        )

        print(serializer.validated_data)

        result = TripPlannerService.generate(
            serializer.validated_data,
        )

        return Response(result)


class LayoverPlannerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LayoverPlannerSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True,
        )

        result = LayoverAIService.generate(
            serializer.validated_data,
        )

        return Response(result)