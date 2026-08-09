import math
import random
from datetime import datetime, timedelta

from apps.flights.models import (
    Airline,
    FlightRoute,
)
from apps.travel.models import Airport


class FlightGenerator:

    # Average cruise speed in km/h
    CRUISE_SPEED = 820

    # Earth's radius used for Haversine distance calculation
    EARTH_RADIUS_KM = 6371

    # =====================================================
    # GENERATE FLIGHT
    # =====================================================

    @classmethod
    def generate(
        cls,
        source_airport,
        destination_airport,
        cabin_class="ECONOMY",
    ):

        source_iata = source_airport.upper()
        destination_iata = destination_airport.upper()

        # =================================================
        # FIND SEEDED FLIGHT ROUTE
        # =================================================

        route = (
            FlightRoute.objects
            .select_related(
                "source_airport__city__country",
                "destination_airport__city__country",
            )
            .filter(
                source_airport__iata_code=source_iata,
                destination_airport__iata_code=destination_iata,
            )
            .first()
        )

        # =================================================
        # USE SEEDED ROUTE
        # =================================================

        if route is not None:

            distance = route.distance_km

            is_domestic = route.is_domestic

            src_airport_obj = (
                route.source_airport
            )

            dst_airport_obj = (
                route.destination_airport
            )

        # =================================================
        # FALLBACK ROUTE
        # =================================================

        else:

            print(
                f"FlightRoute not found: "
                f"{source_iata} → {destination_iata}"
            )

            fallback = cls._build_fallback_route(
                source_iata,
                destination_iata,
            )

            if fallback is None:

                print(
                    f"Unable to build fallback route: "
                    f"{source_iata} → {destination_iata}"
                )

                return None

            (
                distance,
                is_domestic,
                src_airport_obj,
                dst_airport_obj,
            ) = fallback

            print(
                f"Fallback route generated: "
                f"{source_iata} → {destination_iata} "
                f"({distance} km)"
            )

        # =================================================
        # DURATION
        # =================================================

        duration_minutes = cls.calculate_duration(
            distance
        )

        # =================================================
        # DEPARTURE / ARRIVAL
        # =================================================

        departure = cls.generate_departure()

        arrival = (
            departure
            + timedelta(
                minutes=duration_minutes
            )
        )

        # =================================================
        # AIRLINE
        # =================================================

        airline = cls.pick_airline(
            src_airport_obj,
            dst_airport_obj,
        )

        # =================================================
        # AIRCRAFT
        # =================================================

        aircraft = cls.pick_aircraft(
            distance
        )

        # =================================================
        # PRICE
        # =================================================

        price = cls.calculate_price(
            distance=distance,
            cabin=cabin_class,
            domestic=is_domestic,
        )

        # =================================================
        # STOPS
        # =================================================

        stops = cls.calculate_stops(
            distance
        )

        # =================================================
        # BAGGAGE
        # =================================================

        baggage = cls.baggage(
            cabin_class
        )

        # =================================================
        # AIRLINE LOGO
        # =================================================

        airline_logo = ""

        if airline.logo:
            airline_logo = airline.logo

        # =================================================
        # FINAL FLIGHT RESPONSE
        # =================================================

        return {

            # ---------------------------------------------
            # Airline
            # ---------------------------------------------

            "airline": airline.name,

            "airline_name": airline.name,

            "airline_code": airline.code,

            "airline_logo": airline_logo,

            # ---------------------------------------------
            # Flight
            # ---------------------------------------------

            "flight_number": (
                f"{airline.code} "
                f"{random.randint(100, 999)}"
            ),

            # ---------------------------------------------
            # Airports
            # ---------------------------------------------

            "departure_airport": (
                src_airport_obj.iata_code
            ),

            "arrival_airport": (
                dst_airport_obj.iata_code
            ),

            "source_airport": (
                src_airport_obj.iata_code
            ),

            "destination_airport": (
                dst_airport_obj.iata_code
            ),

            # ---------------------------------------------
            # Terminals
            # ---------------------------------------------

            "departure_terminal": "T1",

            "arrival_terminal": "",

            # ---------------------------------------------
            # Timing
            # ---------------------------------------------

            "departure_time": (
                departure.isoformat()
            ),

            "arrival_time": (
                arrival.isoformat()
            ),

            # ---------------------------------------------
            # Duration
            # ---------------------------------------------

            "duration": (
                cls.format_duration(
                    duration_minutes
                )
            ),

            "duration_minutes": (
                duration_minutes
            ),

            # ---------------------------------------------
            # Distance
            # ---------------------------------------------

            "distance_km": distance,

            # ---------------------------------------------
            # Price
            # ---------------------------------------------

            "price": price,

            # ---------------------------------------------
            # Stops
            # ---------------------------------------------

            "stops": stops,

            # ---------------------------------------------
            # Aircraft
            # ---------------------------------------------

            "aircraft": aircraft,

            # ---------------------------------------------
            # Baggage
            # ---------------------------------------------

            "baggage": baggage,

            "baggage_allowance": baggage,

            # ---------------------------------------------
            # Cabin
            # ---------------------------------------------

            "cabin_class": cabin_class,

        }

    # =====================================================
    # FALLBACK ROUTE
    # =====================================================

    @classmethod
    def _build_fallback_route(
        cls,
        source_iata,
        destination_iata,
    ):

        try:

            src = (
                Airport.objects
                .select_related(
                    "city__country"
                )
                .get(
                    iata_code=source_iata.upper()
                )
            )

            dst = (
                Airport.objects
                .select_related(
                    "city__country"
                )
                .get(
                    iata_code=destination_iata.upper()
                )
            )

        except Airport.DoesNotExist as exc:

            print(
                "Airport lookup failed:",
                exc,
            )

            return None

        # =================================================
        # CHECK COORDINATES
        # =================================================

        if (
            src.latitude is None
            or src.longitude is None
        ):

            print(
                f"Missing coordinates for "
                f"{source_iata}"
            )

            return None

        if (
            dst.latitude is None
            or dst.longitude is None
        ):

            print(
                f"Missing coordinates for "
                f"{destination_iata}"
            )

            return None

        # =================================================
        # CALCULATE DISTANCE
        # =================================================

        distance = cls._haversine_km(
            src.latitude,
            src.longitude,
            dst.latitude,
            dst.longitude,
        )

        # =================================================
        # DOMESTIC / INTERNATIONAL
        # =================================================

        is_domestic = (
            src.city.country.code
            == dst.city.country.code
        )

        return (
            distance,
            is_domestic,
            src,
            dst,
        )

    # =====================================================
    # HAVERSINE DISTANCE
    # =====================================================

    @classmethod
    def _haversine_km(
        cls,
        lat1,
        lon1,
        lat2,
        lon2,
    ):

        lat1, lon1, lat2, lon2 = map(
            math.radians,
            [
                float(lat1),
                float(lon1),
                float(lat2),
                float(lon2),
            ],
        )

        dlat = lat2 - lat1

        dlon = lon2 - lon1

        a = (
            math.sin(dlat / 2) ** 2
            + (
                math.cos(lat1)
                * math.cos(lat2)
                * math.sin(dlon / 2) ** 2
            )
        )

        c = (
            2
            * math.asin(
                math.sqrt(a)
            )
        )

        distance = (
            cls.EARTH_RADIUS_KM
            * c
        )

        return round(
            distance
        )

    # =====================================================
    # PRICE
    # =====================================================

    @classmethod
    def calculate_price(
        cls,
        distance,
        cabin,
        domestic,
    ):

        if domestic:

            base = 2000

            per_km = 5.5

        else:

            base = 4500

            per_km = 6.8

        price = (
            base
            + (
                distance
                * per_km
            )
        )

        multiplier = {

            "ECONOMY": 1.0,

            "PREMIUM_ECONOMY": 1.5,

            "BUSINESS": 2.7,

            "FIRST": 4.3,

        }

        price *= multiplier.get(
            cabin,
            1.0,
        )

        variation = random.uniform(
            0.92,
            1.10,
        )

        return round(
            price * variation,
            2,
        )

    # =====================================================
    # DURATION
    # =====================================================

    @classmethod
    def calculate_duration(
        cls,
        distance,
    ):

        flight_time = (
            distance
            / cls.CRUISE_SPEED
        ) * 60

        # Approximate taxi / airport movement time
        taxi_time = 35

        return int(
            flight_time
            + taxi_time
        )

    # =====================================================
    # DEPARTURE
    # =====================================================

    @classmethod
    def generate_departure(
        cls,
    ):

        base = (
            datetime.now()
            .replace(
                minute=0,
                second=0,
                microsecond=0,
            )
        )

        return (
            base
            + timedelta(
                hours=random.randint(
                    2,
                    18,
                )
            )
        )

    # =====================================================
    # STOPS
    # =====================================================

    @classmethod
    def calculate_stops(
        cls,
        distance,
    ):

        # Short / medium routes are generated
        # as direct flights.

        if distance < 3500:

            return 0

        if distance < 8000:

            return 1

        return 2

    # =====================================================
    # BAGGAGE
    # =====================================================

    @classmethod
    def baggage(
        cls,
        cabin,
    ):

        baggage = {

            "ECONOMY": "15 kg",

            "PREMIUM_ECONOMY": "25 kg",

            "BUSINESS": "35 kg",

            "FIRST": "45 kg",

        }

        return baggage.get(
            cabin,
            "15 kg",
        )

    # =====================================================
    # AIRCRAFT
    # =====================================================

    @classmethod
    def pick_aircraft(
        cls,
        distance,
    ):

        if distance < 1000:

            return random.choice(
                [
                    "Airbus A320neo",
                    "Boeing 737 MAX 8",
                ]
            )

        elif distance < 4000:

            return random.choice(
                [
                    "Airbus A321neo",
                    "Airbus A330",
                    "Boeing 787-8 Dreamliner",
                ]
            )

        elif distance < 8000:

            return random.choice(
                [
                    "Airbus A350-900",
                    "Boeing 787-9 Dreamliner",
                    "Boeing 777-300ER",
                ]
            )

        return random.choice(
            [
                "Airbus A380-800",
                "Airbus A350-1000",
                "Boeing 777-300ER",
            ]
        )

    # =====================================================
    # AIRLINE
    # =====================================================

    @classmethod
    def pick_airline(
        cls,
        source_airport_obj,
        destination_airport_obj,
    ):

        source_country = (
            source_airport_obj
            .city
            .country
            .code
        )

        destination_country = (
            destination_airport_obj
            .city
            .country
            .code
        )

        destination_iata = (
            destination_airport_obj
            .iata_code
        )

        # =================================================
        # HUB AIRLINE
        # =================================================

        hub_airlines = (
            Airline.objects
            .filter(
                hub=destination_iata
            )
        )

        if hub_airlines.exists():

            return random.choice(
                list(
                    hub_airlines
                )
            )

        # =================================================
        # INDIA DOMESTIC
        # =================================================

        if (
            source_country == "IN"
            and destination_country == "IN"
        ):

            preferred = [
                "AI",
                "IX",
                "6E",
                "SG",
                "QP",
            ]

        # =================================================
        # INDIA ↔ UAE
        # =================================================

        elif {
            source_country,
            destination_country,
        } == {
            "IN",
            "AE",
        }:

            preferred = [
                "EK",
                "EY",
                "FZ",
                "G9",
                "AI",
                "IX",
                "6E",
            ]

        # =================================================
        # INDIA ↔ QATAR
        # =================================================

        elif {
            source_country,
            destination_country,
        } == {
            "IN",
            "QA",
        }:

            preferred = [
                "QR",
                "AI",
                "6E",
            ]

        # =================================================
        # INDIA ↔ SINGAPORE
        # =================================================

        elif {
            source_country,
            destination_country,
        } == {
            "IN",
            "SG",
        }:

            preferred = [
                "SQ",
                "TR",
                "AI",
                "6E",
            ]

        else:

            preferred = []

        # =================================================
        # FIND PREFERRED AIRLINES
        # =================================================

        airlines = (
            Airline.objects
            .filter(
                code__in=preferred
            )
        )

        if airlines.exists():

            return random.choice(
                list(
                    airlines
                )
            )

        # =================================================
        # FALLBACK TO ANY AIRLINE
        # =================================================

        all_airlines = list(
            Airline.objects.all()
        )

        if not all_airlines:

            raise ValueError(
                "No airlines are available "
                "in the database."
            )

        return random.choice(
            all_airlines
        )

    # =====================================================
    # FORMAT DURATION
    # =====================================================

    @classmethod
    def format_duration(
        cls,
        minutes,
    ):

        hours = minutes // 60

        mins = minutes % 60

        if hours and mins:

            return (
                f"{hours}h "
                f"{mins}m"
            )

        if hours:

            return f"{hours}h"

        return f"{mins}m"