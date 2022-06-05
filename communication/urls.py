from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("chat/api/", include("chat.api.urls", namespace="chat")),
    # path("chat/", include("chat")),
    path("api-auth/", include("dj_rest_auth.urls")),
    path("api-auth/registration/", include("dj_rest_auth.registration.urls")),
    path("account/api/", include("communication.api.urls", namespace="account")),
]
