import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.flights.models import FlightRoute
from apps.travel.models import Airport


class Command(BaseCommand):
    help = "Bulk import FlightRoute records from JSON fixtures"

    BATCH_SIZE = 2000

    def handle(self, *args, **options):

        fixture_dir = Path("data/neon_fixtures")

        route_files = sorted(
            fixture_dir.glob("flightroute_*.json")
        )

        if not route_files:
            self.stdout.write(
                self.style.ERROR(
                    "No FlightRoute fixture files found."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Found {len(route_files)} route fixture files."
            )
        )

        # ==========================================================
        # LOAD ALL AIRPORTS ONCE
        # ==========================================================

        self.stdout.write("Loading airports...")

        airports = {
            airport.pk: airport
            for airport in Airport.objects.all()
        }

        self.stdout.write(
            self.style.SUCCESS(
                f"Loaded {len(airports)} airports."
            )
        )

        if len(airports) == 0:
            self.stdout.write(
                self.style.ERROR(
                    "No airports found. Import airports first."
                )
            )
            return

        # ==========================================================
        # CHECK EXISTING ROUTES
        # ==========================================================

        self.stdout.write(
            "Checking existing FlightRoutes..."
        )

        existing_ids = set(
            FlightRoute.objects.values_list(
                "id",
                flat=True,
            )
        )

        self.stdout.write(
            f"Existing routes: {len(existing_ids)}"
        )

        total_processed = 0
        total_inserted = 0
        total_skipped = 0

        # ==========================================================
        # PROCESS FIXTURE FILES
        # ==========================================================

        for file_number, fixture_path in enumerate(
            route_files,
            start=1,
        ):

            self.stdout.write("")

            self.stdout.write(
                self.style.SUCCESS(
                    f"[{file_number}/{len(route_files)}] "
                    f"Reading {fixture_path.name}"
                )
            )

            with fixture_path.open(
                "r",
                encoding="utf-8",
            ) as file:
                data = json.load(file)

            self.stdout.write(
                f"Records in file: {len(data)}"
            )

            batch = []

            for item in data:

                total_processed += 1

                route_id = item["pk"]
                fields = item["fields"]

                # --------------------------------------------------
                # Skip already imported route
                # --------------------------------------------------

                if route_id in existing_ids:
                    total_skipped += 1
                    continue

                # --------------------------------------------------
                # Airport IDs
                # --------------------------------------------------

                source_airport_id = fields[
                    "source_airport"
                ]

                destination_airport_id = fields[
                    "destination_airport"
                ]

                source_airport = airports.get(
                    source_airport_id
                )

                destination_airport = airports.get(
                    destination_airport_id
                )

                # --------------------------------------------------
                # Invalid airport relationship
                # --------------------------------------------------

                if (
                    source_airport is None
                    or destination_airport is None
                ):
                    total_skipped += 1
                    continue

                # --------------------------------------------------
                # Create object in memory
                # --------------------------------------------------

                batch.append(
                    FlightRoute(
                        pk=route_id,
                        source_airport=source_airport,
                        destination_airport=destination_airport,
                        distance_km=fields["distance_km"],
                        is_domestic=fields.get(
                            "is_domestic",
                            False,
                        ),
                        is_active=fields.get(
                            "is_active",
                            True,
                        ),
                        created_at=fields.get(
                            "created_at"
                        ),
                    )
                )

                # --------------------------------------------------
                # Bulk insert every 2,000 records
                # --------------------------------------------------

                if len(batch) >= self.BATCH_SIZE:

                    with transaction.atomic():

                        FlightRoute.objects.bulk_create(
                            batch,
                            batch_size=self.BATCH_SIZE,
                            ignore_conflicts=True,
                        )

                    total_inserted += len(batch)

                    batch.clear()

                    self.stdout.write(
                        f"Processed: {total_processed:,} | "
                        f"Inserted: {total_inserted:,} | "
                        f"Skipped: {total_skipped:,}"
                    )

            # ======================================================
            # INSERT REMAINING RECORDS
            # ======================================================

            if batch:

                with transaction.atomic():

                    FlightRoute.objects.bulk_create(
                        batch,
                        batch_size=self.BATCH_SIZE,
                        ignore_conflicts=True,
                    )

                total_inserted += len(batch)

                batch.clear()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Completed {fixture_path.name}"
                )
            )

            del data

        # ==========================================================
        # FINAL RESULT
        # ==========================================================

        final_count = FlightRoute.objects.count()

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "FlightRoute import completed!"
            )
        )

        self.stdout.write(
            f"Processed: {total_processed:,}"
        )

        self.stdout.write(
            f"Inserted: {total_inserted:,}"
        )

        self.stdout.write(
            f"Skipped: {total_skipped:,}"
        )

        self.stdout.write(
            f"FlightRoutes in database: {final_count:,}"
        )

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )