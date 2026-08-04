from django.db import models

from apps.travel.models import Airport
from apps.trips.models import Trip


class Airline(models.Model):
    """
    Airline master table.
    Examples:
    Emirates
    IndiGo
    Qatar Airways
    """

    name = models.CharField(
        max_length=120,
        unique=True,
    )

    code = models.CharField(
        max_length=5,
        unique=True,
    )

    logo = models.URLField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Flight(models.Model):

    class CabinClass(models.TextChoices):
        ECONOMY = "ECONOMY", "Economy"
        PREMIUM_ECONOMY = (
            "PREMIUM_ECONOMY",
            "Premium Economy",
        )
        BUSINESS = "BUSINESS", "Business"
        FIRST = "FIRST", "First"

    class FlightType(models.TextChoices):
        OUTBOUND = "OUTBOUND", "Outbound"
        RETURN = "RETURN", "Return"

    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        DELAYED = "DELAYED", "Delayed"
        CANCELLED = "CANCELLED", "Cancelled"

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="flights",
    )

    airline = models.ForeignKey(
        Airline,
        on_delete=models.PROTECT,
        related_name="flights",
    )

    flight_type = models.CharField(
        max_length=20,
        choices=FlightType.choices,
    )

    flight_number = models.CharField(
        max_length=20,
    )

    source_airport = models.ForeignKey(
        Airport,
        on_delete=models.PROTECT,
        related_name="departure_flights",
    )

    destination_airport = models.ForeignKey(
        Airport,
        on_delete=models.PROTECT,
        related_name="arrival_flights",
    )

    departure_datetime = models.DateTimeField()

    arrival_datetime = models.DateTimeField()

    duration_minutes = models.PositiveIntegerField()

    cabin_class = models.CharField(
        max_length=30,
        choices=CabinClass.choices,
        default=CabinClass.ECONOMY,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    stops = models.PositiveIntegerField(
        default=0,
    )

    baggage_allowance = models.CharField(
        max_length=100,
        blank=True,
    )

    refundable = models.BooleanField(
        default=False,
    )

    aircraft = models.CharField(
        max_length=100,
        blank=True,
    )

    terminal = models.CharField(
        max_length=30,
        blank=True,
    )

    gate = models.CharField(
        max_length=20,
        blank=True,
    )

    booking_reference = models.CharField(
        max_length=30,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "departure_datetime",
        ]

    def __str__(self):
        return (
            f"{self.flight_number} "
            f"{self.source_airport.iata_code}"
            f" → "
            f"{self.destination_airport.iata_code}"
        )