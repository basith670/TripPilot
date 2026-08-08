import csv
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand

from apps.travel.models import (
    Airport,
    City,
    Country,
)


class Command(BaseCommand):
    help = "Import worldwide airports"

    def handle(self, *args, **kwargs):

        csv_path = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "data"
            / "airports.csv"
        )

        if not csv_path.exists():
            self.stdout.write(
                self.style.ERROR(
                    "airports.csv not found."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Reading: {csv_path}"
            )
        )

        allowed_types = {
            "large_airport",
            "medium_airport",
            "small_airport",
        }

        imported = 0
        skipped = 0

        countries = {
            country.code: country
            for country in Country.objects.all()
        }

        cities = {}

        with open(
            csv_path,
            newline="",
            encoding="utf-8",
        ) as file:

            reader = csv.DictReader(file)

            for row in reader:

                airport_type = row["type"].strip()

                if airport_type not in allowed_types:
                    skipped += 1
                    continue

                iata_code = row["iata_code"].strip()

                if not iata_code:
                    skipped += 1
                    continue

                country_code = row["iso_country"].strip()

                if country_code not in countries:

                    country = Country.objects.create(
                        code=country_code,
                        name=country_code,
                        currency="",
                        timezone="UTC",
                        is_active=True,
                    )

                    countries[country_code] = country

                country = countries[country_code]

                city_name = (
                    row["municipality"].strip()
                    if row["municipality"]
                    else "Unknown"
                )

                city_key = (
                    country.id,
                    city_name,
                )

                latitude = (
                    Decimal(row["latitude_deg"])
                    if row["latitude_deg"]
                    else None
                )

                longitude = (
                    Decimal(row["longitude_deg"])
                    if row["longitude_deg"]
                    else None
                )

                if city_key not in cities:

                    region = row["iso_region"].split("-")

                    state = ""

                    if len(region) > 1:
                        state = region[1]

                    city, _ = City.objects.get_or_create(
                        country=country,
                        name=city_name,
                        defaults={
                            "state": state,
                            "latitude": latitude,
                            "longitude": longitude,
                            "is_active": True,
                        },
                    )

                    cities[city_key] = city

                city = cities[city_key]

                Airport.objects.get_or_create(
                    iata_code=iata_code,
                    defaults={
                        "city": city,
                        "name": row["name"].strip(),
                        "icao_code": (
                        row["icao_code"].strip()
                        if row["icao_code"].strip()
                        else None
                    ),
                        "latitude": latitude,
                        "longitude": longitude,
                        "is_international": True,
                        "is_active": True,
                    },
                )

                imported += 1

                if imported % 500 == 0:
                    self.stdout.write(
                        f"Imported {imported} airports..."
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nImport Completed!"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported: {imported}"
            )
        )

        self.stdout.write(
            self.style.WARNING(
                f"Skipped: {skipped}"
            )
        )