import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import ActivityLog

print("=" * 60)
print("LIMPEZA DE REGISTROS ANTIGOS DO ACTIVITYLOG")
print("=" * 60)

# Conta registros sem timestamp
old_logs = ActivityLog.objects.filter(timestamp__isnull=True)
count = old_logs.count()

print(f"\n⚠️  Encontrados {count} registros antigos sem timestamp")

if count > 0:
    print(f"\n🗑️  Excluindo {count} registros antigos...")
    deleted_count, _ = old_logs.delete()
    print(f"✅ {deleted_count} registros excluídos com sucesso!")
    print("\n✨ Agora a contagem de jogadores online estará precisa!")
else:
    print("\n✅ Nenhum registro antigo encontrado. Banco de dados limpo!")

print("\n" + "=" * 60)
print("CONCLUÍDO!")
print("=" * 60)
print("\nAtualize a página inicial para ver a contagem correta.")
