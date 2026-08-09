import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.travel.models import City, Country


class Command(BaseCommand):
    help = "Bulk import cities from the Neon fixture."

    BATCH_SIZE = 1000

    def handle(self, *args, **options):

        fixture_path = (
            Path("data/neon_fixtures/travel_city.json")
        )

        if not fixture_path.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"Fixture not found: {fixture_path}"
                )
            )
            return

        self.stdout.write(
            f"Reading {fixture_path}..."
        )

        with fixture_path.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        self.stdout.write(
            f"Found {len(data)} city records."
        )

        countries = {
            country.pk: country
            for country in Country.objects.all()
        }

        cities = []

        for item in data:
            fields = item["fields"]

            country_id = fields["country"]

            country = countries.get(country_id)

            if country is None:
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipping city {item['pk']}: "
                        f"country {country_id} not found."
                    )
                )
                continue

            cities.append(
                City(
                    pk=item["pk"],
                    country=country,
                    name=fields["name"],
                    state=fields.get("state", ""),
                    latitude=fields.get("latitude"),
                    longitude=fields.get("longitude"),
                    is_active=fields.get(
                        "is_active",
                        True,
                    ),
                    created_at=fields.get(
                        "created_at"
                    ),
                    updated_at=fields.get(
                        "updated_at"
                    ),
                )
            )

        total = len(cities)

        self.stdout.write(
            f"Preparing {total} cities for bulk insert..."
        )

        inserted = 0

        for start in range(
            0,
            total,
            self.BATCH_SIZE,
        ):
            batch = cities[
                start:start + self.BATCH_SIZE
            ]

            with transaction.atomic():
                City.objects.bulk_create(
                    batch,
                    batch_size=self.BATCH_SIZE,
                    ignore_conflicts=True,
                )

            inserted += len(batch)

            self.stdout.write(
                f"Processed {inserted}/{total} cities"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"City import completed: {total} records processed."
            )
        )
        








