from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Achievement, DailyQuest, QuizResult
from accounts.models import UserAchievement, UserDailyQuest, UserGamification
from .serializers import (
    AchievementSerializer, 
    DailyQuestSerializer, 
    QuizResultSerializer,
    UserAchievementSerializer,
    UserDailyQuestSerializer,
    AddXpSerializer
)

class AddXpView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AddXpSerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            user_gamification, created = UserGamification.objects.get_or_create(user=request.user)
            user_gamification.xp += amount
            # Lógica de Level Up
            xp_for_next_level = 100 * (user_gamification.level ** 1.5)
            if user_gamification.xp >= xp_for_next_level:
                user_gamification.level += 1
                user_gamification.xp -= int(xp_for_next_level)
            user_gamification.save()
            return Response({'status': 'success', 'new_xp': user_gamification.xp, 'new_level': user_gamification.level}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompleteDailyQuestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        quest_id = kwargs.get('quest_id')
        today = timezone.now().date()
        try:
            user_quest = UserDailyQuest.objects.get(user=request.user, quest_id=quest_id, quest_date=today)
            if not user_quest.is_completed:
                user_quest.is_completed = True
                user_quest.save()
                # Adicionar XP por completar a quest
                user_gamification, created = UserGamification.objects.get_or_create(user=request.user)
                user_gamification.xp += user_quest.quest.xp_reward
                user_gamification.save()
                return Response({'status': 'success', 'message': 'Quest completed!'}, status=status.HTTP_200_OK)
            return Response({'status': 'info', 'message': 'Quest already completed.'}, status=status.HTTP_200_OK)
        except UserDailyQuest.DoesNotExist:
            return Response({'error': 'Quest not found for today.'}, status=status.HTTP_404_NOT_FOUND)

class AchievementListView(generics.ListAPIView):
    """
    Endpoint para listar todas as conquistas disponíveis.
    """
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserAchievementListView(generics.ListAPIView):
    """
    Endpoint para listar as conquistas do usuário logado.
    """
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)

class DailyQuestListView(generics.ListAPIView):
    """
    Endpoint para listar todas as missões diárias disponíveis.
    """
    queryset = DailyQuest.objects.all()
    serializer_class = DailyQuestSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDailyQuestListView(generics.ListAPIView):
    """
    Endpoint para listar o status das missões diárias do usuário logado.
    """
    serializer_class = UserDailyQuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Idealmente, aqui você filtraria por data (ex: hoje)
        from django.utils import timezone
        today = timezone.now().date()
        return UserDailyQuest.objects.filter(user=self.request.user, quest_date=today)

class QuizResultCreateView(generics.CreateAPIView):
    """
    Endpoint para um usuário submeter os resultados de um quiz.
    O serializer já associa o usuário logado automaticamente.
    """
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [permissions.IsAuthenticated]