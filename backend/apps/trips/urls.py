from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TripViewSet
from .activity_views import ActivityViewSet
from .day_views import ItineraryDayViewSet

router = DefaultRouter()

router.register("trips", TripViewSet, basename="trips")
router.register("itinerary-days", ItineraryDayViewSet, basename="itinerary-days")
router.register("activities", ActivityViewSet, basename="activities")

urlpatterns = [
    path("", include(router.urls)),
]