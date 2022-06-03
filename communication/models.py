from aioredis import AuthError
from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

User = get_user_model()


def pkgen():
    from base64 import b32encode
    from hashlib import sha1
    import string
    import random

    pk = "".join(random.choices(string.ascii_letters + string.digits, k=16))
    # pk = b32encode(sha1(str(random()).encode("utf-8")).digest()).lower()[:6]

    return pk


class Account(models.Model):
    userID = models.CharField(max_length=15, primary_key=True, default=pkgen)
    user = models.OneToOneField(User, related_name="account", on_delete=models.CASCADE)
    following = models.ManyToManyField(
        "Account",
        related_name="followers",
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    channel_name = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.userID

    # called whenever there is a new user
    @receiver(post_save, sender=get_user_model())
    def create_account(sender, instance, created, **kwargs):
        if created:
            account = Account.objects.create(userID=instance.username, user=instance)
            # no friends !
