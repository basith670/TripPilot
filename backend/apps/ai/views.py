from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import GenerateItinerarySerializer
from .services import AIItineraryService


class GenerateItineraryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateItinerarySerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = AIItineraryService.generate(
            destination=serializer.validated_data["destination"],
            days=serializer.validated_data["days"],
            budget=serializer.validated_data["budget"],
            travel_style=serializer.validated_data["travel_style"],
        )

        return Response(data)