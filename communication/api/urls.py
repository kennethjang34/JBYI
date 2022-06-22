from django.contrib import admin
from django.urls import path, re_path, include
from .views import *

app_name = "communication"

urlpatterns = [
    re_path("friends", FriendsList.as_view()),
    re_path("friend-requests", FriendRequestCreate.as_view()),
    re_path("accounts", AccountList.as_view())
]
