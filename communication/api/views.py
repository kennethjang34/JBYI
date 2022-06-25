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


# # maybe not needed
# def get_chat_rooms(username):
#     # queryset = Chat.objects.all()
#     if username is not None:
#         account = get_user_account(username)
#         return account.chats.all()
#     return None


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






class FriendRequestCreate(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FriendRequestSerializer
    queryset = FriendRequest.objects.all()
    
   #get_queryset(self):
       
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


#    def patch(self, request, *args, **kwargs):
#
#        return self.partial_update(request, *args, **kwargs)

   # def get_queryset(self):
   #     return Account.objects.filter(userID__contains=self.request.query_params.get("userID"))

# list all chat rooms of this user if there is any. For a particular chat room view, use ChatRetrieve


# list all chat rooms of this user if there is any. For a particular chat room view, use ChatRetrieve
# class ChatList(ListAPIView):
#     # queryset = Chat.objects.all()
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = ChatSerializer

#     def get_queryset(self):
#         return get_user_account(self.request.user).chats.all()
# return get_chat_rooms(username)

# def get(self, request, *args, **kwargs):
#     return self.list(request, *args, **kwargs)


# class ChatDetail(APIView):


# class ChatCreate(CreateAPIView):
#     queryset = Chat.objects.all()
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = ChatSerializer

# def get_queryset(self):
#     self.request.query_params.get
# username = self.request.query_params.get("username", None)
# chat_rooms = get_chat_rooms(username)
# return chat_rooms


# class ChatRetrieve(RetrieveAPIView):
#     queryset = Chat.objects.all().filter()
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = ChatSerializer

# def get_queryset(self):
#     username = self.request.query_params.get("username", None)
#     # query_params.get("id", []) must return a list of id's
#     chat_rooms = get_chat_rooms(username).filter(
#         pk__in=self.request.query_params.get("id", [])
#     )
#     return chat_rooms


# class ChatUpdate(UpdateAPIView):
#     queryset = Chat.objects.all()
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = ChatSerializer

# def get_queryset(self):
#     # queryset = Chat.objects.all()
#     username = self.request.query_params.get("username", None)
#     if username is not None:
#         account = get_user_account(username)
#         return account.chats.all()
#     return None


# class ChatDelete(UpdateAPIView):
#     queryset = Chat.objects.all()
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = ChatSerializer

# def get_queryset(self):
#     # queryset = Chat.objects.all()
#     username = self.request.query_params.get("username", None)
#     if username is not None:
#         account = get_user_account(username)
#         return account.chats.all()
#     return None
