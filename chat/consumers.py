import asyncio
import json
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from chat.api.views import get_chat_rooms
from chat.api.serializers import *
from .models import Message, Chat
from communication.models import Account
import datetime
from django.shortcuts import get_object_or_404
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import channels.layers
from asgiref.sync import async_to_sync
from django.dispatch import receiver
from django.db.models.signals import *
from communication.api.serializers import AccountSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    consumers = {}
    channel_names = {}

    @staticmethod
    def message_to_json(message):
        return json.dumps(message)

    @staticmethod
    @database_sync_to_async
    def serialize_message(message):
        serialized_message = MessageSerializer(message, many=False).data
        return serialized_message

    # ChatConsumer assumes the chat room has already been created
    @staticmethod
    async def get_chat_room(chatID):
        chat = await database_sync_to_async(get_object_or_404)(Chat, pk=chatID)
        return chat

    @staticmethod
    @database_sync_to_async
    def get_serialized_messages(messages):
        serialized_queryset = MessageSerializer(messages, many=True).data
        return list(serialized_queryset)

    @staticmethod
    # @database_sync_to_async
    def get_serialized_accounts(accounts):
        serialized_queryset = AccountSerializer(accounts, many=True).data
        return list(serialized_queryset)

    # messages: queryset of Message model instances
    @staticmethod
    async def messages_to_json(messages):
        message_list = await ChatConsumer.get_serialized_messages(messages)
        # serialized_messages = message_list.data
        json_messages = []
        for message in message_list:
            json_messages.append(ChatConsumer.message_to_json(message))

        return json_messages

    @staticmethod
    @database_sync_to_async
    def get_messages_from_oldest(chat_room):
        messages = chat_room.messages.order_by("-timestamp").all().reverse()

        return messages

    async def handle_previous_message_request(self, data):

        # chat_room: must be an instance of Chat model
        chat_room = await ChatConsumer.get_chat_room(data["chatID"])
        # Later change the implementation so as to limit the number of messages to be sent at a time
        # messages = chat_room.messages.order_by("-timestamp").all().reverse()
        messages = await ChatConsumer.get_messages_from_oldest(chat_room)
        json_messages = await ChatConsumer.messages_to_json(messages)
        await self.send_previous_messages(data["chatID"], json_messages)

    @database_sync_to_async
    def get_chats_with_token(self):
        token = self.scope["url_route"]["kwargs"]["user_token"]
        self.user = (Token.objects.get)(key=token).user
        self.account = self.user.account
        self.chats = list(self.account.chats.all())
        return self.chats

    @database_sync_to_async
    def get_userID(self):
        token = self.scope["url_route"]["kwargs"]["user_token"]
        user = (Token.objects.get)(key=token).user
        return str(user.account.userID)

    @database_sync_to_async
    def get_group_name(self):
        token = self.scope["url_route"]["kwargs"]["user_token"]
        user = (Token.objects.get)(key=token).user
        account = get_object_or_404(Account,user=user)
        return account.group_name
        

    @database_sync_to_async
    def store_channel_name(self):
        self.account.channel_name = self.channel_name
        self.account.save()

    async def connect(self):
        # token = self.scope["url_route"]["kwargs"]["user_token"]
        # userID = await self.get_userID()
        # this sets up self.user and self.account as well
        chats = await self.get_chats_with_token()
        self.room_group_names = []
        await self.store_channel_name()
        await self.channel_layer.group_add(
                await self.get_group_name(),
                self.channel_name,
        )
        user_group_name = await self.get_group_name()
        self.room_group_names.append(user_group_name)
        for chat in chats:
            self.room_group_names.append(chat.chatID)

            await self.channel_layer.group_add(chat.chatID, self.channel_name)
            # await self.channel_layer.group_add(chat.chatID, userID)
        await self.accept()

    async def disconnect(self, close_code):
        for room_group_name in self.room_group_names:
            await self.channel_layer.group_discard(room_group_name, self.channel_name)

    async def send_new_message(self, chatID, message):
        # Send message to room group
        await self.channel_layer.group_send(
            chatID,
            {
                "type": "chat_message_arrive",
                "message": {
                    "message_type": "new_message",
                    "chatID": chatID,
                    "message": message,
                },
            },
        )

    # To use signal, consumer.channel_layer.group_add method had to be made synchronous
    @staticmethod
    def create_new_group(sender, **kwargs):
        instance = kwargs.pop("instance", None)
        action = kwargs.pop("action", None)
        pk_set = kwargs.pop("pk_set", None)
        if action == "post_add":
            chatID = instance.chatID
            participants = instance.participants
            channel_layer = channels.layers.get_channel_layer()
            for participant in participants.all():
                channel_name = participant.channel_name
                async_to_sync(channel_layer.group_add)(chatID, channel_name)

            async_to_sync(channel_layer.group_send)(
                chatID,
                {
                    "type": "notify_new_chat",
                    "message": {
                        "message_type": "new_chat",
                        "chatID": chatID,
                        "participants": ChatConsumer.get_serialized_accounts(
                            participants.all()
                        ),
                    },
                },
            )

    # new message arrives at the server. called once only for each new message
    async def receive(self, text_data):
        data = json.loads(text_data)
        request = data["request"]
        if request == "previous_messages":
            await self.handle_previous_message_request(data)
        else:
            message = data["message"]
            message["author"] = message["author"]
            message["chats"] = message["chatID"]
            account = await sync_to_async(get_object_or_404)(
                Account, pk=message["author"]
            )
            chat_objs = await sync_to_async(Chat.objects.all)()
            if type(message["chatID"]) == type(list()):
                chats = await sync_to_async(chat_objs.filter)(pk__in=message["chatID"])
            else:
                chats = await sync_to_async(chat_objs.filter)(pk=message["chatID"])
            messageObj = await sync_to_async(Message.objects.create)(
                author=account, content=message["content"]
            )
            message["timestamp"] = messageObj.timestamp.__str__()
            await sync_to_async(messageObj.chats.set)(chats)
            # messageSerialized = await (sync_to_async(MessageSerializer)(messageObj))
            messageSerialized = await ChatConsumer.serialize_message(messageObj)
            await self.send_new_message(
                chatID=message["chatID"],
                message=(messageSerialized),
            )

    async def notify(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    async def notify_new_chat(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    # messages must be in json
    async def send_previous_messages(self, chatID, messages):
        await self.send(
            text_data=json.dumps(
                {
                    "message_type": "previous_messages",
                    "chatID": chatID,
                    "messages": messages,
                }
            )
        )

    # Receive message from room group (not from the frontend socket)
    async def chat_message_arrive(self, event):
        await self.send(text_data=json.dumps(event["message"]))


m2m_changed.connect(
    receiver=ChatConsumer.create_new_group, sender=Chat.participants.through
)
