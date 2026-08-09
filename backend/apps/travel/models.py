from django.db import models


class Country(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    code = models.CharField(
        max_length=2,
        unique=True,
        help_text="ISO 3166-1 Alpha-2 Code (e.g. IN, US, AE)",
    )

    currency = models.CharField(
        max_length=10,
    )

    timezone = models.CharField(
        max_length=100,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Countries"

    def __str__(self):
        return f"{self.name} ({self.code})"
    

class City(models.Model):
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name="cities",
    )

    name = models.CharField(
        max_length=100,
    )

    state = models.CharField(
        max_length=100,
        blank=True,
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

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]
        unique_together = ("country", "name")

    def __str__(self):
        return f"{self.name}, {self.country.code}"
    
class Airport(models.Model):
    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        related_name="airports",
    )

    name = models.CharField(
        max_length=150,
    )

    iata_code = models.CharField(
        max_length=3,
        unique=True,
        help_text="Example: COK, BLR, DXB",
    )

    icao_code = models.CharField(
    max_length=4,
    unique=True,
    blank=True,
    null=True,
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

    is_international = models.BooleanField(
        default=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.iata_code} - {self.name}"