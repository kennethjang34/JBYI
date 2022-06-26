from aioredis import AuthError
from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from communication.models import Account

User = get_user_model()


def pkgen():
    from base64 import b32encode
    from hashlib import sha1
    import string
    import random

    pk = "".join(random.choices(string.ascii_letters + string.digits, k=16))
    # pk = b32encode(sha1(str(random()).encode("utf-8")).digest()).lower()[:6]

    return pk


class Message(models.Model):
    messageID = models.CharField(
        max_length=255, primary_key=True, null=False, default=pkgen
    )
    author = models.ForeignKey(
        Account,
        related_name="messages_sent",
        on_delete=models.CASCADE,
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.messageID




class Chat(models.Model):
    chatID = models.CharField(max_length=20, primary_key=True, default=pkgen)
    participants = models.ManyToManyField(Account, related_name="chats")
    # messages sent to multiple chat rooms might exist
    messages = models.ManyToManyField(Message, related_name="chats", blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.chatID
