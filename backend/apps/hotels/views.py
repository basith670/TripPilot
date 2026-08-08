from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Hotel
from .serializers import HotelSerializer


class HotelViewSet(viewsets.ModelViewSet):
    serializer_class = HotelSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "trip",
        "status",
        "room_type",
        "city",
        "country",
        "refundable",
        "breakfast_included",
        "wifi_included",
    ]

    search_fields = [
        "name",
        "city",
        "country",
        "booking_reference",
    ]

    ordering_fields = [
        "check_in",
        "check_out",
        "price",
        "rating",
        "created_at",
    ]

    ordering = [
        "check_in",
    ]

    def get_queryset(self):
        return (
            Hotel.objects.filter(
                trip__user=self.request.user
            )
            .select_related(
                "trip",
            )
        )