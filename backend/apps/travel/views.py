from django.db.models import Q

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Country, City, Airport
from .serializers import (
    CountrySerializer,
    CitySerializer,
    AirportSerializer,
)


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticated]


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticated]


class AirportViewSet(viewsets.ModelViewSet):
    serializer_class = AirportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Airport.objects.select_related(
            "city",
            "city__country",
        ).all()

        search = self.request.query_params.get(
            "search",
            ""
        ).strip()

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(iata_code__icontains=search)
                | Q(city__name__icontains=search)
                | Q(city__country__name__icontains=search)
            )

        return queryset.order_by("name")[:20]