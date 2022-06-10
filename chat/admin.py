from django.contrib import admin
from chat.models import *

from communication.models import *
# Register your models here.
admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Account)
admin.site.register(FriendRequest)
