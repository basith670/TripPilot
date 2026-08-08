from rest_framework import serializers

from .models import Country, City, Airport


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class AirportSerializer(serializers.ModelSerializer):
    city = serializers.CharField(
        source="city.name",
        read_only=True,
    )

    country = serializers.CharField(
        source="city.country.name",
        read_only=True,
    )

    class Meta:
        model = Airport
        fields = [
            "id",
            "name",
            "iata_code",
            "city",
            "country",
        ]