from django.contrib import admin
from django.urls import path, re_path, include
from .views import *

app_name = "communication"

urlpatterns = [
    re_path("friends", FriendsList.as_view()),
    # re_path("create/$", ChatCreate.as_view()),
    # re_path("<pk>$", ChatRetrieve.as_view()),
    # re_path("<pk>/update/$", ChatUpdate.as_view()),
    # re_path("<pk>/delete/$", ChatDelete.as_view()),
]
