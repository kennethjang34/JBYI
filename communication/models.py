from aioredis import AuthError
from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db.models import constraints
from django.core.exceptions import ValidationError
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

    def __str__(self): return self.userID # called whenever there is a new user 
    @receiver(post_save, sender=get_user_model()) 
    def create_account(sender, instance, created, **kwargs): 
        if created: account = Account.objects.create(userID=instance.username, user=instance)
            # no friends !



class FriendRequest(models.Model):
    requester = models.ForeignKey(Account, related_name="friend_requests_sent", on_delete=models.CASCADE)
    receiver = models.ForeignKey(Account, related_name="friend_requests_received", on_delete=models.CASCADE)
    accepted = models.BooleanField(blank=True, null=True, default=None)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Requester: " + self.requester.__str__() + ", Receiver: " + self.receiver.__str__()

    def clean(self):
        if self.accepted==None and (FriendRequest.objects.filter(requester=self.receiver, receiver=self.requester, accepted=None).exists() or FriendRequest.objects.filter(requester=self.requester, receiver=self.receiver, accepted=None).exists() or FriendRequest.objects.filter(requester=self.requester, receiver=self.receiver, accepted=True).exists() or FriendRequest.objects.filter(requester=self.receiver, receiver=self.requester, accepted=True).exists()):
            print(FriendRequest.objects.filter(requester=self.receiver, receiver=self.requester, accepted=None).exists())
            raise ValidationError("The requested friendship is duplicate")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    @staticmethod
    def post_save(sender, instance, created, **kwargs):
        requester = Account.objects.get(userID=instance.requester)
        receiver = Account.objects.get(userID=instance.receiver)
        if instance.accepted == True:
            requester.following.add(receiver)
            receiver.following.add(requester)
        elif instance.accepted == False:
            pass
        else:            
            requester.following.add(receiver)


    class Meta:
        constraints = [
                constraints.UniqueConstraint(
                    fields=['requester', 'receiver','accepted'], name="unique_friend_request"
                    ),
                models.CheckConstraint(
                    name="prevent_self_follow",
                    check=~models.Q(requester=models.F("receiver")),
                    )
                ]



post_save.connect(FriendRequest.post_save, sender=FriendRequest)
