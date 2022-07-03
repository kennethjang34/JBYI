from django.db.models import fields
from rest_framework import serializers

# from chat.models import *
from communication.models import *

# from datetime import timedelta
from django.utils import timezone


class AccountSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(default=timezone.now())
    friends = serializers.StringRelatedField(source="following", many=True)
    # friends = serializers.PrimaryKeyRelatedField(
    #     queryset=Account.objects.all(), many=True, source="following"
    # )

    class Meta:
        model = Account
        # fields = ("userID", "user", "following", "followers", "timestamp")
        fields = ("userID", "user", "friends", "timestamp")

class FriendRequestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    requester = serializers.SlugRelatedField(slug_field="userID", queryset=Account.objects.all())
    receiver = serializers.SlugRelatedField(slug_field="userID", queryset=Account.objects.all())
    lookup_field = 'id'
    def create(self, validated_data):
        return FriendRequest.objects.create(**validated_data)


#    def update(self,instance,validated_data):
#
#        return super().update(self,instance,validated_data)
#

    #def update(self, instance, validated_data):
     #   print("inside serializers")
      #  print(validated_data)
        #instance.save()
       # return instance
    
    class Meta:
        model = FriendRequest
        fields = '__all__'
    
