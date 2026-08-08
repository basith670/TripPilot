from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    TripViewSet,
    LayoverTripViewSet,
    SaveLayoverTripAPIView,
)
from .activity_views import ActivityViewSet
from .day_views import ItineraryDayViewSet

router = DefaultRouter()

router.register(
    "trips",
    TripViewSet,
    basename="trips",
)

router.register(
    "layover-trips",
    LayoverTripViewSet,
    basename="layover-trips",
)

router.register(
    "itinerary-days",
    ItineraryDayViewSet,
    basename="itinerary-days",
)

router.register(
    "activities",
    ActivityViewSet,
    basename="activities",
)

urlpatterns = [
    path(
        "trips/save-layover/",
        SaveLayoverTripAPIView.as_view(),
        name="save-layover",
    ),

    path(
        "",
        include(router.urls),
    ),
]