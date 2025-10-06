from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from .serializers import UserSerializer, UserDetailSerializer, ActivityLogSerializer
from .models import UserPerformance, Subject, ActivityLog, Gamification, Quest, UserQuest
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.shortcuts import get_object_or_404


class CreateUserView(generics.CreateAPIView):
    """
    View para criar um novo usuário no sistema. Após a criação,
    gera e retorna os tokens de acesso (access) e atualização (refresh).
    """
    serializer_class = UserSerializer
    # Permite que qualquer usuário (mesmo não autenticado) acesse esta view.
    permission_classes = [permissions.AllowAny]
    # Adiciona os parsers para lidar com dados de formulário e uploads de arquivos.
    parser_classes = (MultiPartParser, FormParser)
    # Não precisamos mais sobrescrever o método create, a lógica agora está no serializer.


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View para buscar e atualizar os dados do usuário logado.
    Acessível apenas por usuários autenticados.
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) # Adicionado para lidar com a foto

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_object(self):
        # Retorna o usuário associado à requisição atual
        return self.request.user

class UpdatePerformanceView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        results = request.data.get('results', [])
        user = request.user
        today = timezone.now().date()

        for result in results:
            subject_name = result.get('subject')
            correct = result.get('correct', 0)
            incorrect = result.get('incorrect', 0)

            if correct > 0:
                ActivityLog.objects.get_or_create(user=user, date=today, type='pratica')
            if incorrect > 0:
                ActivityLog.objects.get_or_create(user=user, date=today, type='falha')

            try:
                subject = Subject.objects.get(name=subject_name)
                performance, created = UserPerformance.objects.get_or_create(user=user, subject=subject)
                performance.correct_answers += correct
                performance.incorrect_answers += incorrect
                performance.save()
            except Subject.DoesNotExist:
                # Opcional: lidar com o caso de a matéria não existir
                pass

        return Response(status=status.HTTP_204_NO_CONTENT)

class ActivityLogView(generics.ListAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.filter(user=self.request.user)


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

class AddXpView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount', 0)
        user = request.user
        gamification = user.gamification
        gamification.xp += amount
        
        # Check for level up
        xp_for_next_level = 100 * (gamification.level ** 1.5)
        if gamification.xp >= xp_for_next_level:
            gamification.level += 1
            gamification.xp = gamification.xp - xp_for_next_level

        gamification.save()
        
        return Response({
            'new_level': gamification.level,
            'new_xp': gamification.xp
        }, status=status.HTTP_200_OK)


class CompleteQuestView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quest_id, *args, **kwargs):
        user = request.user
        quest = get_object_or_404(Quest, id=quest_id)
        today = timezone.now().date()
        
        user_quest, created = UserQuest.objects.get_or_create(user=user, quest=quest, quest_date=today)
        
        if not user_quest.is_completed:
            user_quest.is_completed = True
            user_quest.save()
            
            # Add XP
            gamification = user.gamification
            gamification.xp += quest.xp_reward
            gamification.save()
            
            # Check for level up after getting XP
            xp_for_next_level = 100 * (gamification.level ** 1.5)
            if gamification.xp >= xp_for_next_level:
                gamification.level += 1
                gamification.xp = int(gamification.xp - xp_for_next_level)
                gamification.save()

        return Response(status=status.HTTP_204_NO_CONTENT)