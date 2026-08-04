from rest_framework import serializers


class GenerateItinerarySerializer(serializers.Serializer):
    destination = serializers.CharField(max_length=100)
    days = serializers.IntegerField(min_value=1, max_value=30)
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