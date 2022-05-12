from django.db.models import fields
from rest_framework import serializers
from chat.models import *


class MessageSerializer(serializers.ModelSerializer):
    class meta:
        model = Message
        fields = ("content", "date", "timestamp")


class ParticipantSerializer(serializers.ModelSerializer):
    class meta:
        model = Account
        fields = ("user", "friends", "timestamp")


class ChatSerializer(serializers.ModelSerializer):
    class meta:
        model: Chat
        fields = ("participants", "messages", "timestamp")
