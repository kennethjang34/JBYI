from aioredis import AuthError
from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

User = get_user_model()


def pkgen():
    from base64 import b32encode
    from hashlib import sha1
    from random import random

    pk = b32encode(sha1(str(random()).encode("utf-8")).digest()).lower()[:6]

    return pk


class Message(models.Model):
    messageID = models.CharField(
        max_length=255, primary_key=True, null=False, default=pkgen
    )
    author = models.ForeignKey(
        "Account",
        related_name="messages_sent",
        on_delete=models.CASCADE,
        default="admin",
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.messageID


class Account(models.Model):
    userID = models.CharField(max_length=15, primary_key=True, default=pkgen)
    user = models.ForeignKey(User, related_name="accounts", on_delete=models.CASCADE)
    following = models.ManyToManyField(
        "Account",
        related_name="followers",
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.userID

    # called whenever there is a new user
    @receiver(post_save, sender=get_user_model())
    def create_account(sender, instance, created, **kwargs):
        if created:
            account = Account.objects.create(userID=instance.username, user=instance)
            # no friends !
            print(account)


class Chat(models.Model):
    chatID = models.CharField(max_length=20, primary_key=True, default=pkgen)
    participants = models.ManyToManyField(Account, related_name="chats")
    # messages sent to multiple chat rooms might exist
    messages = models.ManyToManyField(Message, related_name="chats")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.chatID
