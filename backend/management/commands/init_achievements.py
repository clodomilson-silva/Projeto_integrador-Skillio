"""
Management command para inicializar conquistas (achievements) no banco de dados.

Uso:
    python manage.py init_achievements
"""
from django.core.management.base import BaseCommand
from api.achievements_manager import initialize_achievements


class Command(BaseCommand):
    help = 'Inicializa todas as conquistas (achievements) no banco de dados'

    def handle(self, *args, **options):
        self.stdout.write('Inicializando conquistas...')
        initialize_achievements()
        self.stdout.write(self.style.SUCCESS('✅ Conquistas inicializadas com sucesso!'))
