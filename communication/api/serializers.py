from django.db.models import fields
from rest_framework import serializers

# from chat.models import *
from communication.models import Account

# from datetime import timedelta
from django.utils import timezone


class AccountSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(default=timezone.now())
    friends = serializers.StringRelatedField(source="following", many=True)
    # friends = serializers.PrimaryKeyRelatedField(
    #     queryset=Account.objects.all(), many=True, source="following"
    # )

    class Meta:
        model = Account
        # fields = ("userID", "user", "following", "followers", "timestamp")
        fields = ("userID", "user", "friends", "timestamp")
