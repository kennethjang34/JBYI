from django.db.models import fields
from rest_framework import serializers
from chat.models import *

# from datetime import timedelta
from django.utils import timezone


class AccountSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(default=timezone.now())

    class Meta:
        model = Account
        fields = ("user", "following", "followers", "timestamp")


class ChatSerializer(serializers.ModelSerializer):
    participants = AccountSerializer(many=True)
    timestamp = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S.%fZ", default=timezone.now()
    )

    class Meta:
        model = Chat
        fields = ("participants", "messages", "timestamp")


class MessageSerializer(serializers.ModelSerializer):
    chats = ChatSerializer(many=True)
    timestamp = serializers.DateTimeField(default=timezone.now())

    class Meta:
        model = Message
        fields = ("content", "chats", "author", "timestamp")
