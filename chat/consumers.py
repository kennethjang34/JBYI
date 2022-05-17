import json
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer

from chat.api.views import get_chat_rooms
from chat.api.serializers import *
from .models import Message, Chat, Account
import datetime
from django.shortcuts import get_object_or_404
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    @staticmethod
    def message_to_json(message):
        return json.dumps(message)

    # ChatConsumer assumes the chat room has already been created
    @staticmethod
    async def get_chat_room(chatID):
        # Chat.objects.get_or_create(
        #     participants=self., defaults={"messages": [], "timestamp": datetime()}
        # )
        # list()
        # chats = await database_sync_to_async(Chat.objects.all)()
        # await database_sync_to_async(print)(chats)
        chat = await database_sync_to_async(get_object_or_404)(Chat, pk=chatID)
        return chat

    @staticmethod
    @database_sync_to_async
    def get_serialized_messages(messages):
        serialized_queryset = MessageSerializer(messages, many=True).data
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

    async def handle_previous_message_request(self, data):
        # chat_room: must be an instance of Chat model
        chat_room = await ChatConsumer.get_chat_room(data["chatID"])
        # Later change the implementation so as to limit the number of messages to be sent at a time
        # messages = chat_room.messages.order_by("-timestamp").all()[:30]
        messages = chat_room.messages.order_by("-timestamp").all()
        json_messages = await ChatConsumer.messages_to_json(messages)
        await self.send_previous_messages(data["chatID"], json_messages)

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def send_new_message(self, chatID, message):
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message_arrive",
                "message": {
                    "message_type": "new_message",
                    "chatID": chatID,
                    "message": message,
                },
            },
        )

    #
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
            # print(message)
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
            await self.send_new_message(chatID=message["chatID"], message=message)

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
        # Send message to WebSocket
        # await self.send(text_data=json.dumps({message}))
        # event["message"] is assumed to be in json already
        # just propagate
        await self.send(text_data=json.dumps(event["message"]))
