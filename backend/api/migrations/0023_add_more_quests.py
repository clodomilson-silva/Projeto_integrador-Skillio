from django.db import migrations


def populate_more_quests(apps, schema_editor):
    Quest = apps.get_model('api', 'Quest')
    quests_data = [
        # ── Diárias (novas) ──────────────────────────────────────────────────────
        {
            "id": "practice_10min",
            "description": "Completar uma sessão de estudo de 10 minutos.",
            "xp_reward": 25,
            "type": "daily",
        },
        {
            "id": "practice_30min",
            "description": "Completar uma sessão de estudo de 30 minutos.",
            "xp_reward": 60,
            "type": "daily",
        },
        {
            "id": "complete_5_blocks",
            "description": "Completar 5 blocos de perguntas no dia.",
            "xp_reward": 70,
            "type": "daily",
        },
        {
            "id": "no_errors_block",
            "description": "Completar um bloco inteiro sem errar nenhuma questão.",
            "xp_reward": 45,
            "type": "daily",
        },
        # ── Semanais ─────────────────────────────────────────────────────────────
        {
            "id": "complete_20_blocks_week",
            "description": "Completar 20 blocos de perguntas nesta semana.",
            "xp_reward": 150,
            "type": "weekly",
        },
        {
            "id": "practice_5_days_week",
            "description": "Praticar pelo menos 5 dias diferentes nesta semana.",
            "xp_reward": 100,
            "type": "weekly",
        },
        {
            "id": "correct_50_questions_week",
            "description": "Acertar 50 questões ao longo desta semana.",
            "xp_reward": 120,
            "type": "weekly",
        },
        {
            "id": "top3_weekly_ranking",
            "description": "Alcançar o TOP 3 no ranking semanal.",
            "xp_reward": 200,
            "type": "weekly",
        },
        # ── Mensais ──────────────────────────────────────────────────────────────
        {
            "id": "top1_monthly_ranking",
            "description": "Ser o 1º lugar no ranking mensal.",
            "xp_reward": 500,
            "type": "monthly",
        },
        {
            "id": "complete_100_blocks_month",
            "description": "Completar 100 blocos de perguntas neste mês.",
            "xp_reward": 300,
            "type": "monthly",
        },
        {
            "id": "earn_1000_xp_month",
            "description": "Acumular 1000 XP ao longo do mês.",
            "xp_reward": 250,
            "type": "monthly",
        },
        {
            "id": "login_25_days_month",
            "description": "Fazer login em 25 dias diferentes neste mês.",
            "xp_reward": 200,
            "type": "monthly",
        },
    ]
    for quest_data in quests_data:
        Quest.objects.get_or_create(id=quest_data["id"], defaults=quest_data)


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0022_activitylog_timestamp"),
    ]

    operations = [
        migrations.RunPython(populate_more_quests, migrations.RunPython.noop),
    ]
