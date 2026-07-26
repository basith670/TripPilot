from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model.
    Extend this model with additional fields as the project grows.
    """

    pass