import json
from channels.generic.websocket import WebsocketConsumer
from chat.api.views import get_chat_rooms
from chat.api.serializers import *
from .models import Message, Chat
import datetime
from django.shortcuts import get_object_or_404


class ChatConsumer(WebsocketConsumer):
    @staticmethod
    def message_to_json(message):
        return json.dumps(message)

    # ChatConsumer assumes the chat room has already been created
    @staticmethod
    def get_chat_room(room_name):
        # Chat.objects.get_or_create(
        #     participants=self., defaults={"messages": [], "timestamp": datetime()}
        # )
        return get_object_or_404(Chat, room_name)

    # messages: queryset of Message model instances
    @staticmethod
    def messages_to_json(messages):
        serialized_messages = MessageSerializer(messages, many=True).data
        json_messages = []
        for message in serialized_messages:
            json_messages.append(ChatConsumer.message_to_json(message))

        return json_messages

    def handle_previous_message_request(self, data):
        # chat_room: must be an instance of Chat model
        chat_room = ChatConsumer.get_chat_room(self.room_name)
        messages = chat_room.messages
        json_messages = ChatConsumer.messages_to_json(messages)
        self.send_previous_messages(json_messages)

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        # Join room group
        self.channel_layer.group_add(self.room_group_name, self.channel_name)
        chat_room = ChatConsumer.get_chat_room(self.room_name)
        await self.accept()
        self.send_previous_messages(chat_room.messages)

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def send_new_message(self, message):
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message_arrive", "message": message}
        )

    #
    # new message arrives at the server. called once only for each new message
    async def receive(self, text_data):
        data = json.loads(text_data)
        request = data.request
        if request == "previous_messages":
            self.handle_previous_message_request(data)
        else:
            message = data["message"]
            MessageSerializer(data=message)
            # will create and save a new message model instance from message(only once for each new message)
            MessageSerializer.save()
            self.send_new_message(message)

    # messages must be in json
    async def send_previous_messages(self, messages):
        await self.send(text_data=messages)

    # Receive message from room group (not from the frontend socket)
    async def chat_message_arrive(self, event):
        # Send message to WebSocket
        # await self.send(text_data=json.dumps({message}))
        # event["message"] is assumed to be in json already
        await self.send(text_data=event["message"])
