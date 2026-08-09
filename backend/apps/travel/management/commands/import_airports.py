import csv
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.travel.models import Airport, City, Country


class Command(BaseCommand):
    help = "Import worldwide airports efficiently using bulk inserts"

    BATCH_SIZE = 500

    def handle(self, *args, **kwargs):

        # ==========================================================
        # CSV PATH
        # ==========================================================

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
                    f"airports.csv not found: {csv_path}"
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Reading: {csv_path}"
            )
        )

        # ==========================================================
        # ALLOWED AIRPORT TYPES
        # ==========================================================

        allowed_types = {
            "large_airport",
            "medium_airport",
            "small_airport",
        }

        # ==========================================================
        # LOAD COUNTRIES ONCE
        # ==========================================================

        self.stdout.write("Loading countries...")

        countries = {
            country.code: country
            for country in Country.objects.all()
        }

        self.stdout.write(
            f"Loaded {len(countries)} countries."
        )

        # ==========================================================
        # READ CSV
        # ==========================================================

        airport_rows = []

        missing_country_data = {}

        skipped = 0

        with open(
            csv_path,
            newline="",
            encoding="utf-8",
        ) as file:

            reader = csv.DictReader(file)

            for row in reader:

                # --------------------------------------------------
                # Airport type
                # --------------------------------------------------

                airport_type = (
                    row.get("type", "").strip()
                )

                if airport_type not in allowed_types:
                    skipped += 1
                    continue

                # --------------------------------------------------
                # IATA
                # --------------------------------------------------

                iata_code = (
                    row.get("iata_code", "").strip().upper()
                )

                if not iata_code:
                    skipped += 1
                    continue

                # --------------------------------------------------
                # Country
                # --------------------------------------------------

                country_code = (
                    row.get("iso_country", "").strip().upper()
                )

                if not country_code:
                    skipped += 1
                    continue

                # --------------------------------------------------
                # City
                # --------------------------------------------------

                city_name = (
                    row.get("municipality", "").strip()
                    or "Unknown"
                )

                # --------------------------------------------------
                # Coordinates
                # --------------------------------------------------

                latitude_raw = (
                    row.get("latitude_deg", "").strip()
                )

                longitude_raw = (
                    row.get("longitude_deg", "").strip()
                )

                latitude = (
                    Decimal(latitude_raw)
                    if latitude_raw
                    else None
                )

                longitude = (
                    Decimal(longitude_raw)
                    if longitude_raw
                    else None
                )

                # --------------------------------------------------
                # State / region
                # --------------------------------------------------

                region = (
                    row.get("iso_region", "").strip()
                )

                state = ""

                if "-" in region:
                    state = region.split("-", 1)[1]

                # --------------------------------------------------
                # Country may not exist
                # --------------------------------------------------

                if country_code not in countries:
                    missing_country_data[country_code] = {
                        "code": country_code,
                        "name": country_code,
                        "currency": "",
                        "timezone": "UTC",
                        "is_active": True,
                    }

                # --------------------------------------------------
                # Store row for later bulk processing
                # --------------------------------------------------

                airport_rows.append(
                    {
                        "iata_code": iata_code,
                        "icao_code": (
                            row.get("icao_code", "").strip()
                            or None
                        ),
                        "name": (
                            row.get("name", "").strip()
                        ),
                        "country_code": country_code,
                        "city_name": city_name,
                        "state": state,
                        "latitude": latitude,
                        "longitude": longitude,
                    }
                )

        self.stdout.write(
            f"Found {len(airport_rows)} valid airport records."
        )

        self.stdout.write(
            f"Skipped {skipped} records."
        )

        # ==========================================================
        # CREATE MISSING COUNTRIES
        # ==========================================================

        if missing_country_data:

            self.stdout.write(
                f"Creating {len(missing_country_data)} missing countries..."
            )

            new_countries = [
                Country(**data)
                for data in missing_country_data.values()
            ]

            with transaction.atomic():

                Country.objects.bulk_create(
                    new_countries,
                    batch_size=self.BATCH_SIZE,
                    ignore_conflicts=True,
                )

            # Reload countries after insertion

            countries = {
                country.code: country
                for country in Country.objects.all()
            }

        # ==========================================================
        # LOAD EXISTING CITIES ONCE
        # ==========================================================

        self.stdout.write(
            "Loading existing cities..."
        )

        cities = {}

        for city in City.objects.all():

            key = (
                city.country_id,
                city.name,
            )

            cities[key] = city

        self.stdout.write(
            f"Loaded {len(cities)} existing cities."
        )

        # ==========================================================
        # FIND MISSING CITIES
        # ==========================================================

        missing_cities = {}

        for row in airport_rows:

            country = countries.get(
                row["country_code"]
            )

            if country is None:
                continue

            city_key = (
                country.id,
                row["city_name"],
            )

            if city_key not in cities:

                missing_cities[city_key] = {
                    "country": country,
                    "name": row["city_name"],
                    "state": row["state"],
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                    "is_active": True,
                }

        # ==========================================================
        # BULK CREATE MISSING CITIES
        # ==========================================================

        if missing_cities:

            self.stdout.write(
                f"Creating {len(missing_cities)} missing cities..."
            )

            city_objects = [
                City(**data)
                for data in missing_cities.values()
            ]

            created_cities = []

            for start in range(
                0,
                len(city_objects),
                self.BATCH_SIZE,
            ):

                batch = city_objects[
                    start:start + self.BATCH_SIZE
                ]

                with transaction.atomic():

                    created = City.objects.bulk_create(
                        batch,
                        batch_size=self.BATCH_SIZE,
                        ignore_conflicts=True,
                    )

                created_cities.extend(created)

                self.stdout.write(
                    f"Cities processed: "
                    f"{min(start + self.BATCH_SIZE, len(city_objects))}"
                    f"/{len(city_objects)}"
                )

            # ------------------------------------------------------
            # Re-read cities to guarantee correct IDs
            # ------------------------------------------------------

            cities = {}

            for city in City.objects.all():

                key = (
                    city.country_id,
                    city.name,
                )

                cities[key] = city

        # ==========================================================
        # LOAD EXISTING AIRPORTS
        # ==========================================================

        self.stdout.write(
            "Checking existing airports..."
        )

        iata_codes = {
            row["iata_code"]
            for row in airport_rows
        }

        existing_airports = set(
            Airport.objects
            .filter(
                iata_code__in=iata_codes
            )
            .values_list(
                "iata_code",
                flat=True,
            )
        )

        self.stdout.write(
            f"Existing airports found: "
            f"{len(existing_airports)}"
        )

        # ==========================================================
        # PREPARE AIRPORT OBJECTS
        # ==========================================================

        airport_objects = []

        for row in airport_rows:

            iata_code = row["iata_code"]

            # Already imported
            if iata_code in existing_airports:
                continue

            country = countries.get(
                row["country_code"]
            )

            if country is None:
                continue

            city_key = (
                country.id,
                row["city_name"],
            )

            city = cities.get(city_key)

            if city is None:
                continue

            airport_objects.append(
                Airport(
                    city=city,
                    name=row["name"],
                    iata_code=iata_code,
                    icao_code=row["icao_code"],
                    latitude=row["latitude"],
                    longitude=row["longitude"],
                    is_international=True,
                    is_active=True,
                )
            )

        self.stdout.write(
            f"Airports to insert: "
            f"{len(airport_objects)}"
        )

        # ==========================================================
        # BULK INSERT AIRPORTS
        # ==========================================================

        imported = 0

        for start in range(
            0,
            len(airport_objects),
            self.BATCH_SIZE,
        ):

            batch = airport_objects[
                start:start + self.BATCH_SIZE
            ]

            with transaction.atomic():

                Airport.objects.bulk_create(
                    batch,
                    batch_size=self.BATCH_SIZE,
                    ignore_conflicts=True,
                )

            imported += len(batch)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Imported {imported}/"
                    f"{len(airport_objects)} airports"
                )
            )

        # ==========================================================
        # FINAL RESULT
        # ==========================================================

        total_airports = Airport.objects.count()

        total_cities = City.objects.count()

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Airport import completed!"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Airports in database: {total_airports}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Cities in database: {total_cities}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"New airports imported: {imported}"
            )
        )

        self.stdout.write(
            self.style.WARNING(
                f"CSV records skipped: {skipped}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )