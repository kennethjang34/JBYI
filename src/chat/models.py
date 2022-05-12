from aioredis import AuthError
from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

User = get_user_model()


class Message(models.Model):
    content = models.TextField()
    timestamp = models.DateTimeField()


class Account(models.Model):
    user = models.ForeignKey(User, related_name="accounts", on_delete=models.CASCADE)
    friends = models.ManyToManyField("Account", related_name="accounts")
    timestamp = models.DateTimeField()

    @receiver(post_save, sender=get_user_model())
    def create_user(sender, instance, created, **kwargs):
        if created:
            account = Account.objects.create(user=instance)
            # no friends !
            Account.friends.set([])
            print(account)


class Chat(models.Model):
    participants = models.ManyToManyField(Account, related_name="chats")
    # messages sent to multiple chat rooms might exist
    messages = models.ManyToManyField(Message, related_name="to")
    timestamp = models.DateTimeField()

    def __str__(self):
        return self.name
