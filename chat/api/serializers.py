from django.db.models import fields
from rest_framework import serializers
from chat.models import *


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("content", "author", "timestamp")


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("user", "friends", "timestamp")


class ChatSerializer(serializers.ModelSerializer):
    participants = AccountSerializer()

    class Meta:
        model: Chat
        fields = ("participants", "messages", "timestamp")
