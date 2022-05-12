from django.db.models import fields
from rest_framework import serializers
from src.chat.models import *


class MessageSerializer(serializers.ModelSerializer):
    class meta:
        model = Message
        fields = ""


class ParticipantSerializer(serializers.ModelSerializer):
    class meta:
        model = Account
        fields = ("user", "friends")


class ChatSerializer(serializers.ModelSerializer):
    class meta:
        model: Chat
        fields = ("participants", "messages", "date")
