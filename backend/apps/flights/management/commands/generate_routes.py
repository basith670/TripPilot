import math
import random

from django.core.management.base import BaseCommand

from apps.travel.models import Airport
from apps.flights.models import FlightRoute


class Command(BaseCommand):
    help = "Generate realistic worldwide flight routes"


    def distance(
        self,
        lat1,
        lon1,
        lat2,
        lon2,
    ):
        """
        Haversine Formula
        """

        R = 6371

        lat1 = math.radians(float(lat1))
        lon1 = math.radians(float(lon1))
        lat2 = math.radians(float(lat2))
        lon2 = math.radians(float(lon2))

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(lat1)
            * math.cos(lat2)
            * math.sin(dlon / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a),
        )

        return R * c


    def handle(self, *args, **kwargs):

        FlightRoute.objects.all().delete()

        airports = Airport.objects.exclude(
            latitude__isnull=True
        ).exclude(
            longitude__isnull=True
        )

        airports = list(airports)

        created = 0

        for source in airports:

            nearby = []

            for destination in airports:

                if source.id == destination.id:
                    continue

                dist = self.distance(
                    source.latitude,
                    source.longitude,
                    destination.latitude,
                    destination.longitude,
                )

                nearby.append(
                    (
                        destination,
                        dist,
                    )
                )

            nearby.sort(
                key=lambda x: x[1]
            )

            #
            # closest airports
            #

            closest = nearby[:15]

            #
            # long international routes
            #

            # ==========================================
            # Major Worldwide Hub Airports
            # ==========================================

            HUB_AIRPORTS = [
                "DEL",
                "BOM",
                "BLR",
                "HYD",
                "MAA",
                "COK",

                "DXB",
                "AUH",
                "DOH",
                "SHJ",

                "SIN",
                "KUL",
                "BKK",

                "LHR",
                "CDG",
                "FRA",
                "AMS",

                "IST",

                "JFK",
                "LAX",
                "ORD",

                "NRT",
                "HND",

                "SYD",
            ]

            hub_routes = []

            for hub_code in HUB_AIRPORTS:

                hub = next(
                    (
                        airport
                        for airport in airports
                        if airport.iata_code == hub_code
                    ),
                    None,
                )

                if (
                    hub is None
                    or hub.id == source.id
                ):
                    continue

                dist = self.distance(
                    source.latitude,
                    source.longitude,
                    hub.latitude,
                    hub.longitude,
                )

                hub_routes.append(
                    (
                        hub,
                        dist,
                    )
                )

            routes = closest + hub_routes

            visited = set()

            for destination, dist in routes:

                if destination.id in visited:
                    continue

                visited.add(destination.id)

                FlightRoute.objects.get_or_create(

                    source_airport=source,

                    destination_airport=destination,

                    defaults={
                        "distance_km": int(dist),

                        "is_domestic":
                        source.city.country_id
                        ==
                        destination.city.country_id,

                        "is_active": True,
                    },
                )

                created += 1

            if created % 1000 == 0:

                self.stdout.write(
                    f"Created {created} routes..."
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nFinished.\nRoutes: {created}"
            )
        )