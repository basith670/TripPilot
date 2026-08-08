import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.travel.models import Airport
from apps.flights.models import Airline, Flight


class Command(BaseCommand):
    help = "Generate realistic demo flights"

    def handle(self, *args, **kwargs):

        airports = list(
            Airport.objects.filter(
                is_active=True
            )
        )

        airlines = list(
            Airline.objects.all()
        )

        if not airports:
            self.stdout.write(
                self.style.ERROR(
                    "No airports found."
                )
            )
            return

        if not airlines:
            self.stdout.write(
                self.style.ERROR(
                    "No airlines found."
                )
            )
            return

        created = 0

        for _ in range(5000):

            source = random.choice(
                airports
            )

            destination = random.choice(
                airports
            )

            if source == destination:
                continue

            airline = random.choice(
                airlines
            )

            departure = (
                timezone.now()
                + timedelta(
                    days=random.randint(1, 180),
                    hours=random.randint(0, 23),
                    minutes=random.choice(
                        [0, 15, 30, 45]
                    ),
                )
            )

            duration = random.randint(
                60,
                720,
            )

            arrival = departure + timedelta(
                minutes=duration
            )

            flight_number = (
                airline.code
                + str(
                    random.randint(
                        100,
                        9999,
                    )
                )
            )

            price = round(
                random.randint(
                    2500,
                    45000,
                ),
                2,
            )

            Flight.objects.create(
                airline=airline,

                flight_type=Flight.FlightType.OUTBOUND,

                flight_number=flight_number,

                source_airport=source,

                destination_airport=destination,

                departure_datetime=departure,

                arrival_datetime=arrival,

                duration_minutes=duration,

                cabin_class=Flight.CabinClass.ECONOMY,

                price=price,

                stops=random.randint(
                    0,
                    2,
                ),

                baggage_allowance="20 kg",

                refundable=random.choice(
                    [True, False]
                ),

                aircraft=random.choice(
                    [
                        "Airbus A320",
                        "Airbus A321",
                        "Boeing 737",
                        "Boeing 787",
                        "Airbus A350",
                    ]
                ),

                terminal=str(
                    random.randint(
                        1,
                        5,
                    )
                ),

                gate=chr(
                    random.randint(
                        65,
                        70,
                    )
                )
                + str(
                    random.randint(
                        1,
                        30,
                    )
                ),

                booking_reference="",

                status=Flight.Status.SCHEDULED,

                trip=None,
            )

            created += 1

            if created % 500 == 0:
                self.stdout.write(
                    f"Generated {created} flights..."
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nCreated {created} flights."
            )
        )