from django.db.models import fields
from rest_framework import serializers

# from chat.models import *
from communication.models import *

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



class FriendRequestSerializer(serializers.ModelSerializer):
    requester = serializers.SlugRelatedField(slug_field="userID", queryset=Account.objects.all())
    receiver = serializers.SlugRelatedField(slug_field="userID", queryset=Account.objects.all())
    #receiver = serializers.CharField(source="receiver.userID", read_only=True)
    #requester = serializers.PrimaryKeyRelatedField(many=False, queryset=Account.objects.all())
    #receiver = serializers.PrimaryKeyRelatedField(many=False, queryset=Account.objects.all())
    #requester = serializers.CharField(source="requester.userID", read_only=True)
    class Meta:
        model = FriendRequest
        fields = '__all__'
    
