from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AirlineViewSet,
    FlightViewSet,
)

router = DefaultRouter()

router.register(
    "airlines",
    AirlineViewSet,
    basename="airlines",
)

router.register(
    "flights",
    FlightViewSet,
    basename="flights",
)

urlpatterns = [
    path("", include(router.urls)),
]