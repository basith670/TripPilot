from django.conf import settings

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator

from django.utils.encoding import force_bytes
from django.utils.http import (
    urlsafe_base64_encode,
)

from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from rest_framework_simplejwt.tokens import (
    RefreshToken,
)

from .models import UserProfile

from .email_utils import (
    send_password_reset_email,
)

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    UserProfileSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)

User = get_user_model()


# =====================================================
# REGISTER
# =====================================================

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "User registered successfully."
            },
            status=status.HTTP_201_CREATED,
        )


# =====================================================
# LOGIN (EMAIL + PASSWORD)
# =====================================================

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data[
            "user"
        ]

        refresh = RefreshToken.for_user(
            user
        )

        return Response(
            {
                "access": str(
                    refresh.access_token
                ),
                "refresh": str(refresh),

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            },
            status=status.HTTP_200_OK,
        )


# =====================================================
# CURRENT USER
# =====================================================

class UserProfileView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# =====================================================
# LOGOUT
# =====================================================

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get(
                "refresh"
            )

            if not refresh_token:
                return Response(
                    {
                        "error": "Refresh token is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

            return Response(
                {
                    "message":
                    "Logged out successfully."
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "error":
                    "Invalid or expired refresh token."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# =====================================================
# CHANGE PASSWORD
# =====================================================

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = request.user

        if not user.check_password(
            serializer.validated_data[
                "old_password"
            ]
        ):
            return Response(
                {
                    "error":
                    "Old password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(
            serializer.validated_data[
                "new_password"
            ]
        )

        user.save()

        return Response(
            {
                "message":
                "Password changed successfully."
            },
            status=status.HTTP_200_OK,
        )


# =====================================================
# FORGOT PASSWORD
# =====================================================

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data[
            "email"
        ]

        try:
            user = User.objects.get(
                email__iexact=email
            )

        except User.DoesNotExist:
            return Response(
                {
                    "message":
                    "If an account with this email exists, a reset link has been sent."
                },
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(
            user
        )

        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        )

        send_password_reset_email(
            email=email,
            first_name=user.first_name or user.username,
            reset_link=reset_link,
        )

        return Response(
            {
                "message":
                "Password reset link has been sent."
            },
            status=status.HTTP_200_OK,
        )


# =====================================================
# RESET PASSWORD
# =====================================================

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data[
            "user"
        ]

        user.set_password(
            serializer.validated_data[
                "password"
            ]
        )

        user.save()

        return Response(
            {
                "message":
                "Password has been reset successfully."
            },
            status=status.HTTP_200_OK,
        )
    
# =====================================================
# USER PROFILE
# =====================================================

class UserProfileDetailView(
    RetrieveUpdateAPIView
):
    serializer_class = UserProfileSerializer

    permission_classes = [
        IsAuthenticated
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user
        )

        return profile