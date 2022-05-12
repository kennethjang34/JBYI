from django.contrib import admin
from django.urls import include, path

# from src import chat

urlpatterns = [
    path("admin/", admin.site.urls),
    path("chat/", include("src.chat.api.urls")),
]
