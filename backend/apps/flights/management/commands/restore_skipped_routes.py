import json
import glob

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.travel.models import Airport
from apps.flights.models import FlightRoute


class Command(BaseCommand):
    help = "Restore FlightRoutes whose original airport PKs did not match the new database PKs."

    def handle(self, *args, **options):

        fixture_path = "trippilot_data.json"

        # ==========================================================
        # 1. Load original airport PK -> IATA mapping
        # ==========================================================

        self.stdout.write(
            "Loading original airport mappings..."
        )

        with open(
            fixture_path,
            "r",
            encoding="utf-8",
        ) as file:
            original_data = json.load(file)

        original_airports = {
            obj["pk"]: obj["fields"]["iata_code"]
            for obj in original_data
            if obj["model"] == "travel.airport"
        }

        self.stdout.write(
            f"Original airports loaded: "
            f"{len(original_airports)}"
        )

        # ==========================================================
        # 2. Load all current Neon airports by IATA
        # ==========================================================

        current_airports = {
            airport.iata_code: airport
            for airport in Airport.objects.all()
        }

        self.stdout.write(
            f"Current Neon airports loaded: "
            f"{len(current_airports)}"
        )

        # ==========================================================
        # 3. Find route records whose ORIGINAL airport PKs
        #    are not valid CURRENT airport PKs.
        #
        #    This reproduces the exact reason why the previous
        #    import skipped them.
        # ==========================================================

        current_airport_ids = set(
            Airport.objects.values_list(
                "id",
                flat=True,
            )
        )

        route_files = sorted(
            glob.glob(
                "data/neon_fixtures/flightroute_*.json"
            )
        )

        skipped_routes = []

        for route_file in route_files:

            with open(
                route_file,
                "r",
                encoding="utf-8",
            ) as file:
                routes = json.load(file)

            for route in routes:

                fields = route["fields"]

                source_original_id = fields[
                    "source_airport"
                ]

                destination_original_id = fields[
                    "destination_airport"
                ]

                # This is exactly the condition that caused
                # the original import to skip the route.
                if (
                    source_original_id not in current_airport_ids
                    or destination_original_id not in current_airport_ids
                ):
                    skipped_routes.append(route)

        self.stdout.write(
            f"Routes requiring restoration: "
            f"{len(skipped_routes)}"
        )

        # ==========================================================
        # 4. Restore using:
        #
        # original airport PK
        #        ↓
        # original IATA
        #        ↓
        # current Neon Airport
        # ==========================================================

        restored = 0
        already_exists = 0
        failed = 0

        for route in skipped_routes:

            fields = route["fields"]

            source_original_id = fields[
                "source_airport"
            ]

            destination_original_id = fields[
                "destination_airport"
            ]

            source_iata = original_airports.get(
                source_original_id
            )

            destination_iata = original_airports.get(
                destination_original_id
            )

            if not source_iata or not destination_iata:

                failed += 1

                self.stdout.write(
                    self.style.ERROR(
                        f"Could not map original airport IDs: "
                        f"{source_original_id} -> "
                        f"{destination_original_id}"
                    )
                )

                continue

            source_airport = current_airports.get(
                source_iata
            )

            destination_airport = current_airports.get(
                destination_iata
            )

            if (
                source_airport is None
                or destination_airport is None
            ):

                failed += 1

                self.stdout.write(
                    self.style.ERROR(
                        f"Airport missing in Neon: "
                        f"{source_iata} -> "
                        f"{destination_iata}"
                    )
                )

                continue

            # ======================================================
            # Check by ORIGINAL route PK first
            # ======================================================

            if FlightRoute.objects.filter(
                pk=route["pk"]
            ).exists():

                already_exists += 1
                continue

            # ======================================================
            # Create route using CURRENT airport objects
            # ======================================================

            try:

                with transaction.atomic():

                    FlightRoute.objects.create(
                        pk=route["pk"],
                        source_airport=source_airport,
                        destination_airport=destination_airport,
                        distance_km=fields[
                            "distance_km"
                        ],
                        is_domestic=fields[
                            "is_domestic"
                        ],
                        is_active=fields[
                            "is_active"
                        ],
                        created_at=fields[
                            "created_at"
                        ],
                    )

                restored += 1

                self.stdout.write(
                    f"Restored: "
                    f"{source_iata} -> "
                    f"{destination_iata} "
                    f"(route {route['pk']})"
                )

            except Exception as exc:

                failed += 1

                self.stdout.write(
                    self.style.ERROR(
                        f"Failed route "
                        f"{route['pk']}: {exc}"
                    )
                )

        # ==========================================================
        # 5. Final result
        # ==========================================================

        total_routes = FlightRoute.objects.count()

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "FlightRoute restoration completed!"
            )
        )

        self.stdout.write(
            f"Candidates:      {len(skipped_routes)}"
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Restored:        {restored}"
            )
        )

        self.stdout.write(
            f"Already existed: {already_exists}"
        )

        self.stdout.write(
            self.style.WARNING(
                f"Failed:          {failed}"
            )
        )

        self.stdout.write(
            f"Total routes:    {total_routes}"
        )

        self.stdout.write(
            self.style.SUCCESS(
                "=========================================="
            )
        )