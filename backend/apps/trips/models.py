from django.conf import settings
from django.db import models

from apps.travel.models import Airport


class Trip(models.Model):
    class CabinClass(models.TextChoices):
        ECONOMY = "ECONOMY", "Economy"
        PREMIUM_ECONOMY = "PREMIUM_ECONOMY", "Premium Economy"
        BUSINESS = "BUSINESS", "Business"
        FIRST = "FIRST", "First"

    class TripStatus(models.TextChoices):
        PLANNING = "PLANNING", "Planning"
        CONFIRMED = "CONFIRMED", "Confirmed"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trips",
    )

    source_airport = models.ForeignKey(
        Airport,
        on_delete=models.PROTECT,
        related_name="departing_trips",
    )

    destination_airport = models.ForeignKey(
        Airport,
        on_delete=models.PROTECT,
        related_name="arriving_trips",
    )

    departure_date = models.DateField()

    return_date = models.DateField(
        null=True,
        blank=True,
    )

    travelers = models.PositiveIntegerField(
        default=1,
    )

    cabin_class = models.CharField(
        max_length=30,
        choices=CabinClass.choices,
        default=CabinClass.ECONOMY,
    )

    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=TripStatus.choices,
        default=TripStatus.PLANNING,
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.user.username}: "
            f"{self.source_airport.iata_code} → "
            f"{self.destination_airport.iata_code}"
        )
    
class ItineraryDay(models.Model):
    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="days",
    )

    day_number = models.PositiveIntegerField()

    date = models.DateField()

    title = models.CharField(
        max_length=150,
        default="Travel Day",
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["day_number"]
        unique_together = ("trip", "day_number")

    def __str__(self):
        return f"{self.trip} - Day {self.day_number}"
    
class Activity(models.Model):

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    itinerary_day = models.ForeignKey(
        ItineraryDay,
        on_delete=models.CASCADE,
        related_name="activities",
    )

    title = models.CharField(
        max_length=200,
    )

    location = models.CharField(
        max_length=200,
        blank=True,
    )

    start_time = models.TimeField()

    end_time = models.TimeField(
        null=True,
        blank=True,
    )

    estimated_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "start_time",
        ]

    def __str__(self):
        return self.title