from functools import partial
from django.contrib.auth import get_user_model
from django.http import QueryDict
from django.shortcuts import get_object_or_404
#from requests import Response
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import filters
from rest_framework import status
from rest_framework.generics import (
    ListAPIView,
    RetrieveUpdateAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
)

from .serializers import AccountSerializer
from .serializers import *

# from chat.models import *
from communication.models import Account

User = get_user_model()


def get_user(username):
    user = User.objects.filter(username=username)
    if user is not None:
        return user[0]
    return None




def get_account_from_user(user):
    return get_object_or_404(Account, pk=user.username)


def get_account(username):
    return get_account_from_user(get_user(username))

class AccountRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AccountSerializer
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def get_queryset(self):
        return Account.objects.filter(userID__contains=self.request.query_params.get("userID"))

class AccountListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.filter(userID__contains=self.request.query_params.get("userID"))

class FriendsListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AccountSerializer

    def get_queryset(self):
        print(self.request.query_params.get("userID"))
        if self.request.user.username != self.request.query_params.get("userID"):
            raise permissions.exceptions.PermissionDenied("Permission Denied")
        return get_account(self.request.query_params.get("userID")).following.all()


class FriendsUpdate(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.field = request.value
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "friend successfully added"})






class FriendRequestCreateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FriendRequestSerializer
    queryset = FriendRequest.objects.all()
    
       
class FriendRequestRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FriendRequestSerializer
    queryset = FriendRequest.objects.all()
    
    model=FriendRequest
    fields=['op','field','value']

    def partial_update(self,request, *args, **kwargs):
        instance = FriendRequest.objects.get(pk=kwargs['pk'])
        data = {request.data['field']: request.data['value'], 'id': kwargs['pk']}
        #in FriendRequestSerializer(), try adding id of the request
        serializer = FriendRequestSerializer(instance, data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


