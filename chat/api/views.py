from django.contrib.auth import get_user_model
from django.http import QueryDict
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
)
from .serializers import *
from chat.models import *
from communication.models import Account

User = get_user_model()


def get_user_account(username):
    account_list = User.objects.filter(username=username)
    if account_list is not None:
        return account_list[0]
    return None


# maybe not needed
def get_chat_rooms(username):
    # queryset = Chat.objects.all()
    if username is not None:
        account = get_user_account(username)
        return account.chats.all()
    return None


def get_user_account(user):
    return get_object_or_404(Account, pk=user.username)


# list all chat rooms of this user if there is any. For a particular chat room view, use ChatRetrieve
class ChatList(ListAPIView):
    # queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

    def get_queryset(self):
        return get_user_account(self.request.user).chats.all()
        # return get_chat_rooms(username)

    # def get(self, request, *args, **kwargs):
    #     return self.list(request, *args, **kwargs)


# class ChatDetail(APIView):


class ChatCreate(CreateAPIView):
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

    # def get_queryset(self):
    #     self.request.query_params.get
    # username = self.request.query_params.get("username", None)
    # chat_rooms = get_chat_rooms(username)
    # return chat_rooms


class ChatRetrieve(RetrieveAPIView):
    queryset = Chat.objects.all().filter()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

    # def get_queryset(self):
    #     username = self.request.query_params.get("username", None)
    #     # query_params.get("id", []) must return a list of id's
    #     chat_rooms = get_chat_rooms(username).filter(
    #         pk__in=self.request.query_params.get("id", [])
    #     )
    #     return chat_rooms


class ChatUpdate(UpdateAPIView):
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

    # def get_queryset(self):
    #     # queryset = Chat.objects.all()
    #     username = self.request.query_params.get("username", None)
    #     if username is not None:
    #         account = get_user_account(username)
    #         return account.chats.all()
    #     return None


class ChatDelete(UpdateAPIView):
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

    # def get_queryset(self):
    #     # queryset = Chat.objects.all()
    #     username = self.request.query_params.get("username", None)
    #     if username is not None:
    #         account = get_user_account(username)
    #         return account.chats.all()
    #     return None
