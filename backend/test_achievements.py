"""
Script de teste para verificar o sistema de conquistas.
Execute este script após fazer login no Django Admin ou shell.

Para usar:
1. cd backend
2. python manage.py shell < test_achievements.py

OU

2. python manage.py shell
3. exec(open('test_achievements.py').read())
"""

from django.contrib.auth.models import User
from api.models import Achievement, UserAchievement, Gamification, UserProfile
from api.achievements_manager import initialize_achievements, check_and_unlock_achievements
import json

print("\n" + "="*60)
print("🧪 TESTE DO SISTEMA DE CONQUISTAS")
print("="*60 + "\n")

# 1. Inicializar conquistas
print("📋 Passo 1: Inicializando conquistas...")
initialize_achievements()
total_achievements = Achievement.objects.count()
print(f"✅ {total_achievements} conquistas disponíveis no sistema\n")

# 2. Criar usuário de teste (ou usar existente)
username = "test_achievements@example.com"
print(f"👤 Passo 2: Preparando usuário de teste '{username}'...")

try:
    user = User.objects.get(username=username)
    print(f"✅ Usuário já existe")
    # Limpar conquistas antigas do teste
    UserAchievement.objects.filter(user=user).delete()
    print(f"🧹 Conquistas antigas removidas")
except User.DoesNotExist:
    user = User.objects.create_user(
        username=username,
        email=username,
        password='Test123!'
    )
    print(f"✅ Novo usuário criado")

# Garantir que tem perfil e gamification
profile, _ = UserProfile.objects.get_or_create(user=user)
gamification, _ = Gamification.objects.get_or_create(
    user=user,
    defaults={'level': 1, 'xp': 0, 'streak': 0, 'hearts': 5}
)

print(f"   Level: {gamification.level}")
print(f"   XP: {gamification.xp}")
print(f"   Blocos: {len(profile.blocos_completos or [])}\n")

# 3. Teste: SEM blocos completados (não deve desbloquear)
print("🧪 Teste 1: Verificar conquistas SEM blocos completados...")
unlocked = check_and_unlock_achievements(user)
print(f"   Resultado: {len(unlocked)} conquistas desbloqueadas")
print(f"   Esperado: 0 conquistas")
print(f"   Status: {'✅ PASSOU' if len(unlocked) == 0 else '❌ FALHOU'}\n")

# 4. Teste: COM 1 bloco completado (deve desbloquear "Primeiro Passo")
print("🧪 Teste 2: Adicionar 1 bloco e verificar conquista...")
blocos = ['nivel1-bloco1']
profile.blocos_completos = blocos
profile.save()
profile.refresh_from_db()

print(f"   Blocos no perfil: {profile.blocos_completos}")

unlocked = check_and_unlock_achievements(user)
print(f"   Resultado: {len(unlocked)} conquistas desbloqueadas")
print(f"   IDs: {unlocked}")
print(f"   Esperado: ['bloco_1']")
print(f"   Status: {'✅ PASSOU' if unlocked == ['bloco_1'] else '❌ FALHOU'}\n")

# 5. Teste: Verificar novamente (não deve desbloquear de novo)
print("🧪 Teste 3: Verificar novamente (não deve duplicar)...")
unlocked = check_and_unlock_achievements(user)
print(f"   Resultado: {len(unlocked)} conquistas desbloqueadas")
print(f"   Esperado: 0 conquistas (já foi desbloqueada)")
print(f"   Status: {'✅ PASSOU' if len(unlocked) == 0 else '❌ FALHOU'}\n")

# 6. Teste: Adicionar XP e verificar conquista de XP
print("🧪 Teste 4: Adicionar 1000 XP e verificar conquista...")
gamification.xp = 1000
gamification.save()
gamification.refresh_from_db()

print(f"   XP no gamification: {gamification.xp}")

unlocked = check_and_unlock_achievements(user)
print(f"   Resultado: {len(unlocked)} conquistas desbloqueadas")
print(f"   IDs: {unlocked}")
print(f"   Esperado: ['xp_1000']")
print(f"   Status: {'✅ PASSOU' if unlocked == ['xp_1000'] else '❌ FALHOU'}\n")

# 7. Verificar total de conquistas do usuário
total_user_achievements = UserAchievement.objects.filter(user=user).count()
print("="*60)
print(f"📊 RESUMO FINAL:")
print(f"   Usuário: {user.username}")
print(f"   Conquistas desbloqueadas: {total_user_achievements}/12")
print(f"   Esperado: 2 conquistas (bloco_1 + xp_1000)")
print(f"   Status: {'✅ SISTEMA OK' if total_user_achievements == 2 else '❌ VERIFICAR LOGS'}")
print("="*60 + "\n")

# Listar conquistas desbloqueadas
print("🏆 Conquistas desbloqueadas:")
for ua in UserAchievement.objects.filter(user=user).select_related('achievement'):
    print(f"   - {ua.achievement.name} ({ua.achievement.id})")
    print(f"     {ua.achievement.description}")
    print(f"     Desbloqueada em: {ua.unlocked_at.strftime('%Y-%m-%d %H:%M:%S')}\n")

print("✅ Teste completo!")
print("\n💡 Próximo passo: Testar no frontend jogando um bloco na trilha.\n")
