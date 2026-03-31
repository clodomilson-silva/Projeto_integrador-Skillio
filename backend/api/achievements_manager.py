"""
Utilitário para gerenciar conquistas (achievements) automaticamente.
"""
from django.contrib.auth.models import User
from api.models import Achievement, UserAchievement


# Definição de todas as conquistas disponíveis no sistema
ACHIEVEMENTS_DEFINITIONS = [
    # Conquistas de Blocos Completos
    {
        'id': 'bloco_1',
        'name': 'Primeiro Passo',
        'description': 'Complete seu primeiro bloco de perguntas.',
        'icon': 'Footprints',
        'check': lambda stats: stats['blocos'] >= 1,
    },
    {
        'id': 'blocos_10',
        'name': 'Pegando o Ritmo',
        'description': 'Complete 10 blocos.',
        'icon': 'TrendingUp',
        'check': lambda stats: stats['blocos'] >= 10,
    },
    {
        'id': 'blocos_50',
        'name': 'Maratonista do Saber',
        'description': 'Complete 50 blocos.',
        'icon': 'Award',
        'check': lambda stats: stats['blocos'] >= 50,
    },
    {
        'id': 'blocos_100',
        'name': 'Centurião do Conhecimento',
        'description': 'Complete 100 blocos.',
        'icon': 'Shield',
        'check': lambda stats: stats['blocos'] >= 100,
    },
    
    # Conquistas de Nível
    {
        'id': 'nivel_5',
        'name': 'Aprendiz Dedicado',
        'description': 'Alcance o Nível 5.',
        'icon': 'Star',
        'check': lambda stats: stats['level'] >= 5,
    },
    {
        'id': 'nivel_10',
        'name': 'Estudante Experiente',
        'description': 'Alcance o Nível 10.',
        'icon': 'Medal',
        'check': lambda stats: stats['level'] >= 10,
    },
    {
        'id': 'nivel_20',
        'name': 'Mestre do Nivelamento',
        'description': 'Alcance o Nível 20.',
        'icon': 'Trophy',
        'check': lambda stats: stats['level'] >= 20,
    },
    
    # Conquistas de Sequência (Streak)
    {
        'id': 'streak_3',
        'name': 'Consistência é a Chave',
        'description': 'Mantenha uma sequência de 3 dias.',
        'icon': 'Flame',
        'check': lambda stats: stats['streak'] >= 3,
    },
    {
        'id': 'streak_7',
        'name': 'Hábito Formado',
        'description': 'Mantenha uma sequência de 7 dias.',
        'icon': 'CalendarCheck',
        'check': lambda stats: stats['streak'] >= 7,
    },
    {
        'id': 'streak_30',
        'name': 'Lenda Viva',
        'description': 'Mantenha uma sequência de 30 dias.',
        'icon': 'Crown',
        'check': lambda stats: stats['streak'] >= 30,
    },
    
    # Conquistas de XP
    {
        'id': 'xp_1000',
        'name': 'Acumulador de XP',
        'description': 'Acumule 1000 XP.',
        'icon': 'Zap',
        'check': lambda stats: stats['xp'] >= 1000,
    },
    {
        'id': 'xp_5000',
        'name': 'Força do Conhecimento',
        'description': 'Acumule 5000 XP.',
        'icon': 'Gem',
        'check': lambda stats: stats['xp'] >= 5000,
    },
]


def initialize_achievements():
    """
    Cria ou atualiza todas as conquistas no banco de dados.
    Deve ser chamado ao inicializar o sistema ou via migration.
    """
    for achievement_def in ACHIEVEMENTS_DEFINITIONS:
        Achievement.objects.update_or_create(
            id=achievement_def['id'],
            defaults={
                'name': achievement_def['name'],
                'description': achievement_def['description'],
                'icon': achievement_def['icon'],
            }
        )
    print(f"✅ {len(ACHIEVEMENTS_DEFINITIONS)} conquistas inicializadas/atualizadas")


def check_and_unlock_achievements(user: User) -> list:
    """
    Verifica e desbloqueia automaticamente todas as conquistas
    que o usuário merece baseado em suas estatísticas atuais.
    
    Args:
        user: Usuário para verificar conquistas
        
    Returns:
        Lista de IDs de conquistas recém-desbloqueadas
    """
    newly_unlocked = []
    
    # IMPORTANTE: Recarrega dados do banco para evitar cache stale
    try:
        user.refresh_from_db()
    except:
        pass  # Caso já esteja descartado
    
    # Busca estatísticas atuais do usuário
    gamification = getattr(user, 'gamification', None)
    if not gamification:
        return newly_unlocked
    
    # Recarrega gamification do banco para garantir dados atualizados
    try:
        gamification.refresh_from_db()
    except:
        pass
    
    profile = getattr(user, 'profile', None)
    if profile:
        # Recarrega profile do banco para garantir blocos_completos atualizados
        try:
            profile.refresh_from_db()
        except:
            pass
    
    blocos_completos = []
    if profile:
        blocos = profile.blocos_completos or []
        if isinstance(blocos, str):
            import json
            try:
                blocos = json.loads(blocos)
            except:
                blocos = []
        blocos_completos = blocos
    
    # Monta dicionário de estatísticas
    stats = {
        'xp': gamification.xp,
        'level': gamification.level,
        'streak': gamification.streak,
        'blocos': len(blocos_completos),
    }
    
    print(f"🔍 check_and_unlock_achievements: User {user.username}")
    print(f"   Stats: Level={stats['level']}, XP={stats['xp']}, Streak={stats['streak']}, Blocos={stats['blocos']}")
    print(f"   Blocos completos: {blocos_completos}")
    
    # Pega conquistas já desbloqueadas pelo usuário
    unlocked_ids = set(
        UserAchievement.objects.filter(user=user).values_list('achievement_id', flat=True)
    )
    
    print(f"   Conquistas já desbloqueadas: {list(unlocked_ids)}")
    
    # Verifica cada conquista
    for achievement_def in ACHIEVEMENTS_DEFINITIONS:
        achievement_id = achievement_def['id']
        
        # Se já está desbloqueada, pula
        if achievement_id in unlocked_ids:
            continue
        
        # Verifica se o usuário merece essa conquista
        try:
            should_unlock = achievement_def['check'](stats)
            if should_unlock:
                # Desbloqueia a conquista
                achievement_obj = Achievement.objects.get(pk=achievement_id)
                UserAchievement.objects.create(
                    user=user,
                    achievement=achievement_obj
                )
                newly_unlocked.append(achievement_id)
                print(f"🏆 Conquista desbloqueada: {achievement_def['name']} ({achievement_id}) para {user.username}")
        except Achievement.DoesNotExist:
            # Conquista não existe no banco, precisa rodar initialize_achievements()
            print(f"⚠️ Conquista {achievement_id} não existe no banco de dados")
            continue
        except Exception as e:
            # Erro ao verificar critério
            print(f"❌ Erro ao verificar conquista {achievement_id}: {e}")
            continue
    
    if newly_unlocked:
        print(f"✅ Total de {len(newly_unlocked)} conquistas desbloqueadas nesta verificação")
    else:
        print(f"   Nenhuma conquista nova desbloqueada nesta verificação")
    
    return newly_unlocked
