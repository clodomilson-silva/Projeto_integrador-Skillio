import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Verifica registros de ActivityLog
from api.models import ActivityLog

print("=" * 60)
print("VERIFICAÇÃO DE JOGADORES ONLINE")
print("=" * 60)

# Total de registros
total_logs = ActivityLog.objects.count()
print(f"\n📊 Total de registros no ActivityLog: {total_logs}")

# Registros com timestamp NULL
null_timestamps = ActivityLog.objects.filter(timestamp__isnull=True).count()
print(f"⚠️  Registros sem timestamp (NULL): {null_timestamps}")

# Registros com timestamp válido
valid_timestamps = ActivityLog.objects.filter(timestamp__isnull=False).count()
print(f"✅ Registros com timestamp válido: {valid_timestamps}")

# Últimos 15 minutos
last_15_minutes = timezone.now() - timedelta(minutes=15)
recent_logs = ActivityLog.objects.filter(
    timestamp__isnull=False,
    timestamp__gte=last_15_minutes
)
recent_count = recent_logs.count()
print(f"\n🕒 Atividades nos últimos 15 minutos: {recent_count}")

if recent_count > 0:
    print("\n📋 Detalhes das atividades recentes:")
    for log in recent_logs[:10]:
        print(f"   - Usuário: {log.user.username}, Timestamp: {log.timestamp}, Tipo: {log.type}")

# Usuários online
online_users = User.objects.filter(
    activity_logs__timestamp__isnull=False,
    activity_logs__timestamp__gte=last_15_minutes
).distinct()

print(f"\n👥 Usuários online (últimos 15 min): {online_users.count()}")
for user in online_users:
    print(f"   - {user.username}")

print("\n" + "=" * 60)
print("SOLUÇÃO: Limpar registros antigos sem timestamp?")
print("=" * 60)
print(f"\nSe limpar {null_timestamps} registros antigos, a contagem será mais precisa.")
print("\nDeseja limpar? Execute:")
print("  python backend/clean_old_logs.py")
