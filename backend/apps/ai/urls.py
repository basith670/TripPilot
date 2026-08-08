from django.urls import path

from .views import (
    GenerateItineraryView,
    GenerateTripView,
    LayoverPlannerAPIView,
)

urlpatterns = [
    path(
        "generate-itinerary/",
        GenerateItineraryView.as_view(),
        name="generate-itinerary",
    ),
    path(
        "generate-trip/",
        GenerateTripView.as_view(),
        name="generate-trip",
    ),
    path(
        "layover/",
        LayoverPlannerAPIView.as_view(),
        name="layover-planner",
    ),
]