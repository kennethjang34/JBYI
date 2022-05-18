from django.db.models import fields
from rest_framework import serializers
from chat.models import *

# from datetime import timedelta
from django.utils import timezone


class AccountSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(default=timezone.now())

    class Meta:
        model = Account
        fields = ("userID", "user", "following", "followers", "timestamp")


class MessageSerializer(serializers.ModelSerializer):
    # chats = ChatSerializer(many=True)
    chats = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    timestamp = serializers.DateTimeField(default=timezone.now())

    class Meta:
        model = Message
        fields = ("messageID", "content", "chats", "author", "timestamp")


class ChatSerializer(serializers.ModelSerializer):
    participants = AccountSerializer(many=True)
    timestamp = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S.%fZ", default=timezone.now()
    )
    messages = MessageSerializer(many=True)

    class Meta:
        model = Chat
        fields = ("chatID", "participants", "messages", "timestamp")
