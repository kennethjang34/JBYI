from aioredis import AuthError
from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.db.models import constraints
from django.core.exceptions import ValidationError
from asgiref.sync import async_to_sync
import channels.layers
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
    user = models.OneToOneField(User,
                                related_name="account",
                                on_delete=models.CASCADE,
                                blank=True)
    following = models.ManyToManyField("Account",
                                       related_name="followers",
                                       blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    channel_name = models.CharField(max_length=100, default="")

    # called whenever there is a new user
    def __str__(self):
        return self.userID

    @receiver(post_save, sender=get_user_model())
    def create_account(sender, instance, created, **kwargs):
        if created:
            account = Account.objects.create(userID=instance.username,
                                             user=instance)
            # no friends !

    @property
    def group_name(self):
        """
        Returns a group name based on the user's id to be used by Django Channels.
        Example usage:
        user = User.objects.get(pk=1)
        group_name = user.group_name
        """
        return "user-%s" % self.userID


class FriendRequest(models.Model):
    requester = models.ForeignKey(Account,
                                  related_name="friend_requests_sent",
                                  on_delete=models.CASCADE)
    receiver = models.ForeignKey(Account,
                                 related_name="friend_requests_received",
                                 on_delete=models.CASCADE)
    accepted = models.BooleanField(blank=True, null=True, default=None)
    timestamp = models.DateTimeField(auto_now_add=True)

   # def __str__(self):
   #     return "Requester: " + self.requester.__str__(
   #     ) + ", Receiver: " + self.receiver.__str__()

    def clean(self):
        if self.accepted == None and (
                FriendRequest.objects.filter(requester=self.receiver,
                                             receiver=self.requester,
                                             accepted=None).exists()
                or FriendRequest.objects.filter(requester=self.requester,
                                                receiver=self.receiver,
                                                accepted=None).exists()
                or FriendRequest.objects.filter(requester=self.requester,
                                                receiver=self.receiver,
                                                accepted=True).exists()
                or FriendRequest.objects.filter(requester=self.receiver,
                                                receiver=self.requester,
                                                accepted=True).exists()):
            raise ValidationError("The requested friendship is duplicate")

    def save(self, *args, **kwargs):
        self.full_clean()
        if (self.pk and FriendRequest.objects.get(pk=self.pk).accepted != self.accepted): 
            update_fields = []
            update_fields.append("accepted")
            return super().save(update_fields=update_fields,*args, **kwargs)

        return super().save(*args, **kwargs)
    #@staticmethod
   # def pre_save(sender, instance, *args, **kwargs):
   #     print("in pre_save")
   #     print(kwargs)
   #     print(dir(instance))
        

    @staticmethod
    def post_save(sender, instance, created, **kwargs):
        requester = Account.objects.get(userID=instance.requester)
        receiver = Account.objects.get(userID=instance.receiver)
        update_fields = kwargs.pop("update_fields")
        from communication.api.serializers import AccountSerializer
        if update_fields and "accepted" in update_fields:
            if instance.accepted == True:
                requester.following.add(receiver)
                receiver.following.add(requester)
                channel_layer = channels.layers.get_channel_layer()
                requester_group_name = requester.group_name
                receiver_group_name = receiver.group_name
                async_to_sync(channel_layer.group_send)(
                    requester_group_name,
                    {
                        "type": "notify",
                        "message": {
                            "message_type": "friend_request_accepted",
                            "friend": AccountSerializer(receiver).data,
                        },
                    },
                )
                async_to_sync(channel_layer.group_send)(
                    receiver_group_name,
                    {
                        "type": "notify",
                        "message": {
                           #Here, the message_type is different from the one for the requester.
                            "message_type": "friend_request_resolved",
                            "friend": AccountSerializer(requester).data,
                        },
                    },
                )

            elif instance.accepted == False:
                pass
        elif created:
            channel_layer = channels.layers.get_channel_layer()
            requester_group_name = requester.group_name
            receiver_group_name = receiver.group_name
            from communication.api.serializers import FriendRequestSerializer
            async_to_sync(channel_layer.group_send)(
                receiver_group_name,
                {
                    "type": "notify",
                    "message": {
                        "message_type": "friend_request_received",
                        "friend_request":
                        FriendRequestSerializer(instance).data,
                    },
                },
            )

    class Meta:

        constraints = [
            constraints.UniqueConstraint(
                fields=['requester', 'receiver', 'accepted'],
                name="unique_friend_request"),
            models.CheckConstraint(
                name="prevent_self_follow",
                check=~models.Q(requester=models.F("receiver")),
            )
        ]

#pre_save.connect(FriendRequest.pre_save, sender=FriendRequest)
post_save.connect(FriendRequest.post_save, sender=FriendRequest)
