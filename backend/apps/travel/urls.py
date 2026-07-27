from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CountryViewSet, CityViewSet, AirportViewSet

router = DefaultRouter()
router.register("countries", CountryViewSet, basename="countries")
router.register("cities", CityViewSet, basename="cities")
router.register(
    "airports",
    AirportViewSet,
    basename="airports",
)

urlpatterns = [
    path("", include(router.urls)),
]