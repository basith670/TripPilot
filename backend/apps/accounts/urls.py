from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    RegisterView,
    LoginView,
    UserProfileView,
    LogoutView,
    ChangePasswordView,
    UserProfileDetailView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    # ==========================================
    # Authentication
    # ==========================================

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    # ==========================================
    # User
    # ==========================================

    path(
        "me/",
        UserProfileView.as_view(),
        name="current-user",
    ),

    path(
        "profile/",
        UserProfileDetailView.as_view(),
        name="profile",
    ),

    # ==========================================
    # Password
    # ==========================================

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password",
    ),

    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),
]