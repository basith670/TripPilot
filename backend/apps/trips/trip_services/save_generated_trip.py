from datetime import datetime, timedelta, time

from apps.trips.models import ItineraryDay, Activity

from django.db import transaction

from apps.travel.models import Airport
from apps.flights.models import Airline, Flight
from apps.hotels.models import Hotel
from apps.trips.models import Trip


@transaction.atomic
def save_generated_trip(
    *,
    user,
    planner,
    ai_trip,
):
    """
    Save AI generated trip.

    Current version saves:
    - Trip
    - Flight
    - Hotel

    Next step:
    - Itinerary Days
    - Activities
    """

    # ==========================================================
    # AIRPORTS
    # ==========================================================

    print("=" * 60)
    print(planner)
    print("=" * 60)
    print("SOURCE:", repr(planner["source_airport"]))
    print("DESTINATION:", repr(planner["destination_airport"]))
    print("=" * 60)

    source_airport = Airport.objects.get(
        iata_code__iexact=planner["source_airport"]
    )

    destination_airport = Airport.objects.get(
        iata_code__iexact=planner["destination_airport"]
    )

    # ==========================================================
    # TRIP
    # ==========================================================

    trip = Trip.objects.create(
        user=user,
        source_airport=source_airport,
        destination_airport=destination_airport,
        departure_date=planner["departure_date"],
        return_date=planner["return_date"],
        budget=planner["budget"],
        adults=planner["adults"],
        children=planner["children"],
        infants=planner["infants"],
        seniors=planner["seniors"],
        cabin_class=planner["cabin_class"],
        title=ai_trip["trip_summary"]["title"],
        overview=ai_trip["trip_summary"]["overview"],
    )

    # ==========================================================
    # AIRLINE
    # ==========================================================

    flight_data = ai_trip["flight"]

    airline = Airline.objects.get(
        code=flight_data["airline_code"]
    )

    # ==========================================================
    # FLIGHT
    # ==========================================================

    flight = Flight.objects.create(
    trip=trip,

    airline=airline,

    flight_type=Flight.FlightType.OUTBOUND,

    flight_number=flight_data["flight_number"],

    source_airport=source_airport,

    destination_airport=destination_airport,

    departure_datetime=datetime.fromisoformat(
        flight_data["departure_time"]
    ),

    arrival_datetime=datetime.fromisoformat(
        flight_data["arrival_time"]
    ),

    duration_minutes=int(
        flight_data["duration"]
        .split("h")[0]
    ) * 60 + int(
        flight_data["duration"]
        .split("h")[1]
        .replace("m", "")
        .strip()
    ),

    cabin_class=planner["cabin_class"],

    price=flight_data["price"],

    stops=flight_data["stops"],

    baggage_allowance=flight_data["baggage"],

    refundable=False,

    aircraft=flight_data["aircraft"],

    terminal=flight_data["departure_terminal"],

    gate="",

    booking_reference="",
)

    # ==========================================================
    # HOTEL
    # ==========================================================

    hotel_data = ai_trip["hotel"]

    hotel = Hotel.objects.create(
        trip=trip,
        name=hotel_data["name"],
        image=hotel_data.get(
            "image",
            "",
        ),
        rating=hotel_data["rating"],
        address=hotel_data["address"],
        city=hotel_data["city"],
        country=hotel_data["country"],
        check_in=datetime.fromisoformat(
            planner["departure_date"] + "T15:00:00"
        ),
        check_out=datetime.fromisoformat(
            planner["return_date"] + "T11:00:00"
        ),
        room_type=hotel_data["room_type"],
        guests=(
            planner["adults"]
            + planner["children"]
            + planner["infants"]
            + planner["seniors"]
        ),
        rooms=hotel_data["rooms"],
        price=hotel_data["total_price"],
        breakfast_included=(
            "Breakfast"
            in hotel_data["amenities"]
        ),
        wifi_included=(
            "WiFi"
            in hotel_data["amenities"]
        ),
        parking_available=(
            "Parking"
            in hotel_data["amenities"]
        ),
        amenities=",".join(
            hotel_data["amenities"]
        ),
    )

        # ==========================================================
    # LINK SELECTED ITEMS
    # ==========================================================

    trip.selected_flight = flight
    trip.selected_hotel = hotel

    trip.save(
        update_fields=[
            "selected_flight",
            "selected_hotel",
        ]
    )

    # ==========================================================
    # ITINERARY
    # ==========================================================

    departure_date = datetime.fromisoformat(
        planner["departure_date"]
    ).date()

    for day_data in ai_trip["itinerary"]:

        itinerary_day = ItineraryDay.objects.create(
            trip=trip,
            day_number=day_data["day"],
            date=departure_date + timedelta(days=day_data["day"] - 1),
            title=day_data["title"],
        )

        for activity in day_data["activities"]:

            activity_time = datetime.strptime(
                activity["time"],
                "%H:%M",
            ).time()

            Activity.objects.create(
                itinerary_day=itinerary_day,

                title=activity["title"],

                description=activity.get(
                    "description",
                    "",
                ),

                location=activity.get(
                    "location",
                    "",
                ),

                city=activity.get(
                    "city",
                    "",
                ),

                country=activity.get(
                    "country",
                    "",
                ),

                transport=activity.get(
                    "transport",
                    "",
                ),

                start_time=activity_time,

                end_time=time(
                    activity_time.hour,
                    activity_time.minute,
                ),

                estimated_cost=activity.get(
                    "estimated_cost",
                    0,
                ),

                category=activity.get(
                    "category",
                    Activity.Category.ACTIVITIES,
                ),

                priority=activity.get(
                    "priority",
                    Activity.Priority.MEDIUM,
                ),
            )

    return trip