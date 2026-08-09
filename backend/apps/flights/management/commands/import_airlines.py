import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from apps.flights.models import Airline


class Command(BaseCommand):
    help = "Import airlines from airlines.csv"

    def handle(self, *args, **kwargs):

        csv_path = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "data"
            / "airlines.csv"
        )

        if not csv_path.exists():
            self.stdout.write(
                self.style.ERROR(
                    "airlines.csv not found."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Reading: {csv_path}"
            )
        )

        imported = 0
        updated = 0

        with open(
            csv_path,
            newline="",
            encoding="utf-8",
        ) as file:

            reader = csv.DictReader(file)

            for row in reader:

                airline, created = Airline.objects.update_or_create(
                    code=row["code"].strip(),
                    defaults={
                        "name": row["name"].strip(),
                        "country": row["country"].strip(),
                        "hub": row["hub"].strip(),
                        "airline_type": row["type"].strip(),
                    },
                )

                if created:
                    imported += 1
                else:
                    updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                "\n========== Import Completed =========="
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported : {imported}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Updated  : {updated}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Total    : {Airline.objects.count()}"
            )
        )