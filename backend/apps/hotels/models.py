from django.db import models

from apps.trips.models import Trip


class Hotel(models.Model):

    class RoomType(models.TextChoices):
        STANDARD = "STANDARD", "Standard"
        DELUXE = "DELUXE", "Deluxe"
        SUITE = "SUITE", "Suite"
        EXECUTIVE = "EXECUTIVE", "Executive"
        FAMILY = "FAMILY", "Family"

    class Status(models.TextChoices):
        RESERVED = "RESERVED", "Reserved"
        CHECKED_IN = "CHECKED_IN", "Checked In"
        CHECKED_OUT = "CHECKED_OUT", "Checked Out"
        CANCELLED = "CANCELLED", "Cancelled"

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="hotels",
    )

    name = models.CharField(
        max_length=200,
    )

    image = models.URLField(
        blank=True,
    )

    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=5.0,
    )

    address = models.CharField(
        max_length=255,
    )

    city = models.CharField(
        max_length=100,
    )

    country = models.CharField(
        max_length=100,
    )

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    check_in = models.DateTimeField()

    check_out = models.DateTimeField()

    room_type = models.CharField(
        max_length=30,
        choices=RoomType.choices,
        default=RoomType.STANDARD,
    )

    guests = models.PositiveIntegerField(
        default=2,
    )

    rooms = models.PositiveIntegerField(
        default=1,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    booking_reference = models.CharField(
        max_length=50,
        blank=True,
    )

    refundable = models.BooleanField(
        default=False,
    )

    breakfast_included = models.BooleanField(
        default=False,
    )

    wifi_included = models.BooleanField(
        default=True,
    )

    parking_available = models.BooleanField(
        default=False,
    )

    amenities = models.TextField(
        blank=True,
        help_text="Comma separated amenities",
    )

    notes = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RESERVED,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "check_in",
        ]

    @property
    def nights(self):
        return (
            self.check_out.date()
            - self.check_in.date()
        ).days

    def __str__(self):
        return (
            f"{self.name} "
            f"({self.city})"
        )