from rest_framework import serializers

from .models import ItineraryDay


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = "__all__"
        read_only_fields = ("trip",)