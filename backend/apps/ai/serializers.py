from rest_framework import serializers


class GenerateItinerarySerializer(serializers.Serializer):
    destination = serializers.CharField(max_length=100)

    days = serializers.IntegerField(
        min_value=1,
        max_value=30,
    )

    budget = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    travel_style = serializers.ChoiceField(
        choices=[
            "Budget",
            "Standard",
            "Luxury",
            "Adventure",
            "Family",
            "Solo",
            "Business",
        ]
    )


class GenerateTripSerializer(serializers.Serializer):

    # Airports

    source_airport = serializers.CharField(
        max_length=10,
    )

    destination_airport = serializers.CharField(
        max_length=10,
    )

    # Dates

    departure_date = serializers.DateField()

    return_date = serializers.DateField(
        required=False,
        allow_null=True,
    )

    # Budget

    budget = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    # Travellers

    adults = serializers.IntegerField(
        min_value=1,
    )

    children = serializers.IntegerField(default=0)

    infants = serializers.IntegerField(default=0)

    seniors = serializers.IntegerField(default=0)

    # Flight

    cabin_class = serializers.ChoiceField(
        choices=[
            "ECONOMY",
            "PREMIUM_ECONOMY",
            "BUSINESS",
            "FIRST",
        ]
    )

    # Style

    travel_style = serializers.ChoiceField(
        choices=[
            "BUDGET",
            "MID_RANGE",
            "LUXURY",
            "ADVENTURE",
            "BUSINESS",
            "FAMILY",
            "COUPLE",
            "SOLO",
        ]
    )

    # Transport

    transport = serializers.ChoiceField(
        choices=[
            "AI",
            "TAXI",
            "METRO",
            "BUS",
            "RENTAL_CAR",
            "WALKING",
        ]
    )

    # Food

    food_preference = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    # Interests

    interests = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )

    # Hotels

    hotel_amenities = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )


class LayoverPlannerSerializer(serializers.Serializer):

    departure_airport = serializers.CharField(
        max_length=3,
    )

    layover_airport = serializers.CharField(
        max_length=3,
    )

    destination_airport = serializers.CharField(
        max_length=3,
    )

    arrival_date = serializers.DateField()

    arrival_time = serializers.TimeField()

    departure_date = serializers.DateField()

    departure_time = serializers.TimeField()

    budget = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    travel_style = serializers.CharField()

    visa_required = serializers.BooleanField()

    checked_baggage = serializers.BooleanField()

    lounge_access = serializers.BooleanField()

    interests = serializers.ListField(
        child=serializers.CharField(),
        default=list,
    )