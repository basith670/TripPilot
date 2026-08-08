from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import serializers

from .models import UserProfile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
        ]

    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        email = attrs["email"].strip().lower()

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise serializers.ValidationError(
                {
                    "email":
                    "An account with this email already exists."
                }
            )

        attrs["email"] = email

        return attrs

    def create(self, validated_data):

        validated_data.pop(
            "confirm_password"
        )

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"].lower(),
            first_name=validated_data.get(
                "first_name",
                "",
            ),
            last_name=validated_data.get(
                "last_name",
                "",
            ),
            password=validated_data["password"],
        )
    
class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        email = attrs["email"].strip().lower()
        password = attrs["password"]

        try:
            user = User.objects.get(
                email__iexact=email
            )

        except User.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "email":
                    "Invalid email or password."
                }
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                {
                    "email":
                    "Invalid email or password."
                }
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {
                    "email":
                    "Account is inactive."
                }
            )

        attrs["user"] = user

        return attrs


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
        ]

        read_only_fields = fields


class ChangePasswordSerializer(
    serializers.Serializer
):

    old_password = serializers.CharField(
        write_only=True
    )

    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        if (
            attrs["new_password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        validate_password(
            attrs["new_password"]
        )

        return attrs


class UserProfileSerializer(
    serializers.ModelSerializer
):

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    first_name = serializers.CharField(
        source="user.first_name"
    )

    last_name = serializers.CharField(
        source="user.last_name"
    )

    email = serializers.EmailField(
        source="user.email"
    )

    class Meta:
        model = UserProfile

        fields = [
            "username",
            "first_name",
            "last_name",
            "email",

            "profile_picture",
            "phone_number",
            "date_of_birth",
            "country",
            "city",
            "bio",

            "preferred_currency",
            "preferred_language",
            "theme",

            "is_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "username",
            "is_verified",
            "created_at",
            "updated_at",
        ]

    def update(
        self,
        instance,
        validated_data,
    ):

        user_data = validated_data.pop(
            "user",
            {},
        )

        user = instance.user

        user.first_name = user_data.get(
            "first_name",
            user.first_name,
        )

        user.last_name = user_data.get(
            "last_name",
            user.last_name,
        )

        if "email" in user_data:
            new_email = (
                user_data["email"]
                .strip()
                .lower()
            )

            existing = User.objects.filter(
                email__iexact=new_email
            ).exclude(
                pk=user.pk
            )

            if existing.exists():
                raise serializers.ValidationError(
                    {
                        "email":
                        "An account with this email already exists."
                    }
                )

            user.email = new_email

        user.save()

        return super().update(
            instance,
            validated_data,
        )


class ForgotPasswordSerializer(
    serializers.Serializer
):

    email = serializers.EmailField()

    def validate_email(
        self,
        value,
    ):
        return value.strip().lower()


class ResetPasswordSerializer(
    serializers.Serializer
):

    uid = serializers.CharField()

    token = serializers.CharField()

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(
        self,
        attrs,
    ):

        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        try:

            uid = force_str(
                urlsafe_base64_decode(
                    attrs["uid"]
                )
            )

            user = User.objects.get(
                pk=uid
            )

        except Exception:
            raise serializers.ValidationError(
                {
                    "token":
                    "Invalid reset link."
                }
            )

        if not default_token_generator.check_token(
            user,
            attrs["token"],
        ):
            raise serializers.ValidationError(
                {
                    "token":
                    "Reset link has expired."
                }
            )

        validate_password(
            attrs["password"],
            user,
        )

        attrs["user"] = user

        return attrs