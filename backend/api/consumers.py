import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone


class OnlinePlayersConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer que envia a contagem de jogadores online em tempo real.

    Fluxo:
    - connect(): entra no grupo, envia contagem atual imediatamente,
                 inicia task periódica (a cada 10s).
    - disconnect(): cancela a task periódica, sai do grupo.
    - A task periódica consulta o banco e envia apenas para esta conexão,
      evitando mensagens duplicadas quando há vários clientes.
    - O método `send_online_count` permite que código externo (ex: signals)
      dispare um broadcast via channel_layer.group_send().
    """

    GROUP_NAME = "online_players"

    async def connect(self):
        await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
        await self.accept()

        # Envia contagem inicial imediatamente
        count = await self.get_online_count()
        await self.send(text_data=json.dumps({"online_players": count}))

        # Inicia task periódica por conexão
        self._task = asyncio.ensure_future(self._send_periodically())

    async def disconnect(self, close_code):
        if hasattr(self, "_task"):
            self._task.cancel()
        await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        # O frontend não envia dados; ignorar qualquer mensagem recebida
        pass

    async def _send_periodically(self):
        """Atualiza a contagem a cada 10 segundos para esta conexão."""
        try:
            while True:
                await asyncio.sleep(10)
                count = await self.get_online_count()
                await self.send(text_data=json.dumps({"online_players": count}))
        except asyncio.CancelledError:
            pass

    # --- Handler para broadcasts via channel_layer.group_send() ---
    async def send_online_count(self, event):
        """
        Chamado quando qualquer código faz:
            channel_layer.group_send("online_players", {"type": "send_online_count", "count": N})
        Útil para notificar imediatamente ao salvar um ActivityLog (via signal).
        """
        await self.send(text_data=json.dumps({"online_players": event["count"]}))

    # --- DB query (síncrona executada em thread pool) ---
    @database_sync_to_async
    def get_online_count(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        last_15 = timezone.now() - timezone.timedelta(minutes=15)
        return (
            User.objects.filter(
                activity_logs__timestamp__isnull=False,
                activity_logs__timestamp__gte=last_15,
            )
            .distinct()
            .count()
        )
