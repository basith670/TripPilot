"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Authentication
    path("api/v1/accounts/", include("apps.accounts.urls")),

    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    # Travel APIs
    path("api/v1/travel/", include("apps.travel.urls")),

    # Trips & Itinerary APIs
    path("api/v1/", include("apps.trips.urls")),

    # Dashboard APIs
    path(
        "api/v1/dashboard/",
        include("apps.dashboard.urls"),
    ),

    # AI APIs
    path(
        "api/v1/ai/",
        include("apps.ai.urls"),
    ),

    path("api/v1/flights/", include("apps.flights.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )