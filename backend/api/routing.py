from django.urls import re_path
from api import consumers

websocket_urlpatterns = [
    re_path(r"^ws/online-players/$", consumers.OnlinePlayersConsumer.as_asgi()),
]
