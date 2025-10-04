from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, permissions
from .serializers import UserSerializer, UserDetailSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser


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


class UserProfileView(generics.RetrieveAPIView):
    """
    View para buscar os dados do usuário logado.
    Acessível apenas por usuários autenticados.
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_object(self):
        # Retorna o usuário associado à requisição atual
        return self.request.user

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})