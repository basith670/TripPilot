from rest_framework.routers import DefaultRouter

from .views import HotelViewSet

router = DefaultRouter()

router.register(
    "hotels",
    HotelViewSet,
    basename="hotel",
)

urlpatterns = router.urls