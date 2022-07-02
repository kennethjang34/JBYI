from django.contrib import admin
from django.urls import path, re_path, include
from .views import *

app_name = "communication"

urlpatterns = [
    re_path(r"friends/(?P<userID>[\w]+)/$", FriendsListView.as_view()),
    re_path(r"friends", FriendsListView.as_view()),
    re_path(r"friend-requests/(?P<pk>\d+)/?$", FriendRequestRetrieveUpdateView.as_view()),
    re_path(r"friend-requests/$", FriendRequestListCreateView.as_view()),
    #accounts/ will lead to an error
    re_path(r"accounts", AccountListView.as_view()),
    re_path(r"accounts/(?P<pk>[-\w]+)/$", AccountRetrieveUpdateView.as_view())
]

