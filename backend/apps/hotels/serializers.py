from rest_framework import serializers

from .models import Hotel


class HotelSerializer(serializers.ModelSerializer):

    nights = serializers.ReadOnlyField()

    room_type_display = serializers.CharField(
        source="get_room_type_display",
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    amenities_list = serializers.SerializerMethodField()

    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Hotel

        fields = (
            "id",
            "trip",

            "name",
            "image",

            "rating",

            "address",
            "city",
            "country",

            "latitude",
            "longitude",

            "check_in",
            "check_out",
            "nights",

            "room_type",
            "room_type_display",

            "guests",
            "rooms",

            "price",
            "total_price",

            "booking_reference",

            "refundable",

            "breakfast_included",
            "wifi_included",
            "parking_available",

            "amenities",
            "amenities_list",

            "notes",

            "status",
            "status_display",

            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "nights",
            "total_price",
        )

    def get_amenities_list(self, obj):
        if not obj.amenities:
            return []

        return [
            amenity.strip()
            for amenity in obj.amenities.split(",")
            if amenity.strip()
        ]

    def get_total_price(self, obj):
        return obj.price

    def validate(self, attrs):
        check_in = attrs.get(
            "check_in",
            getattr(self.instance, "check_in", None),
        )

        check_out = attrs.get(
            "check_out",
            getattr(self.instance, "check_out", None),
        )

        guests = attrs.get(
            "guests",
            getattr(self.instance, "guests", None),
        )

        rooms = attrs.get(
            "rooms",
            getattr(self.instance, "rooms", None),
        )

        price = attrs.get(
            "price",
            getattr(self.instance, "price", None),
        )

        rating = attrs.get(
            "rating",
            getattr(self.instance, "rating", None),
        )

        if (
            check_in
            and check_out
            and check_out <= check_in
        ):
            raise serializers.ValidationError(
                {
                    "check_out":
                    "Check-out must be after check-in."
                }
            )

        if guests is not None and guests < 1:
            raise serializers.ValidationError(
                {
                    "guests":
                    "Guests must be at least 1."
                }
            )

        if rooms is not None and rooms < 1:
            raise serializers.ValidationError(
                {
                    "rooms":
                    "Rooms must be at least 1."
                }
            )

        if price is not None and price < 0:
            raise serializers.ValidationError(
                {
                    "price":
                    "Price cannot be negative."
                }
            )

        if (
            rating is not None
            and (rating < 0 or rating > 5)
        ):
            raise serializers.ValidationError(
                {
                    "rating":
                    "Rating must be between 0 and 5."
                }
            )

        return attrs