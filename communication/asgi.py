import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import chat.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "communication.settings")

application = ProtocolTypeRouter(
    {
        # If you want to split HTTP handling between long-poll handlers and Django views,
        # use a URLRouter using Django’s get_asgi_application()
        # specified as the last entry with a match-everything pattern.
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(URLRouter(chat.routing.websocket_urlpatterns)),
    }
)
