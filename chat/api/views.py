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
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

    def get_queryset(self):
        return get_user_account(self.request.user).chats.all()



class ChatCreate(CreateAPIView):
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer



class ChatRetrieve(RetrieveAPIView):
    queryset = Chat.objects.all().filter()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer



class ChatUpdate(UpdateAPIView):
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer



class ChatDelete(UpdateAPIView):
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ChatSerializer

