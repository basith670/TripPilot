from rest_framework import serializers

from .models import ItineraryDay


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay

        fields = (
            "id",
            "trip",
            "day_number",
            "date",
            "title",
            "notes",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "trip",
            "day_number",
            "created_at",
            "updated_at",
        )

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Title cannot be empty."
            )

        return value