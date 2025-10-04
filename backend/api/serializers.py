from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    # Trazendo os campos do perfil para o serializer principal.
    # O DRF não lida bem com FormData aninhado por padrão.
    # `write_only=True` significa que esses campos são usados para criar/atualizar, mas não são mostrados na resposta.
    birth_date = serializers.DateField(write_only=True, required=False, allow_null=True)
    educational_level = serializers.CharField(write_only=True, required=False, allow_blank=True)
    profession = serializers.CharField(write_only=True, required=False, allow_blank=True)
    focus = serializers.CharField(write_only=True, required=False, allow_blank=True)
    foto = serializers.ImageField(write_only=True, required=False)
    # Este campo deve ser obrigatoriamente `True`.
    # Adicionamos um validador para garantir isso.
    terms_accepted = serializers.BooleanField(
        write_only=True,
    )

    # Campos para retornar os tokens na resposta
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    email = serializers.EmailField(
        required=True,
        # Adiciona um validador que verifica se já existe um usuário com este email.
        validators=[UniqueValidator(queryset=User.objects.all(), message="Já existe uma conta com este e-mail.")]
    )

    class Meta:
        model = User
        fields = (
            'email', 'password', 'first_name', 'foto',
            'birth_date', 'educational_level', 'profession', 'focus', 'terms_accepted',
            'access', 'refresh'
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_terms_accepted(self, value):
        if not value:
            raise ValidationError("Você deve aceitar os termos e condições para se registrar.")
        return value

    def create(self, validated_data):
        # Separamos os dados que pertencem ao UserProfile
        profile_fields = ['birth_date', 'educational_level', 'profession', 'focus', 'terms_accepted', 'foto']
        profile_data = {field: validated_data.pop(field) for field in profile_fields if field in validated_data}

        # Usamos o email como username para garantir unicidade e facilitar o login
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
        )

        # Criamos o perfil do usuário com os dados extras
        UserProfile.objects.create(
            user=user,
            **profile_data
        )

        # Gera os tokens para o usuário recém-criado
        refresh = RefreshToken.for_user(user)

        # Adiciona os tokens ao objeto user para que sejam incluídos na resposta
        user.refresh = refresh
        user.access = refresh.access_token

        return user


# --- Serializers para Leitura de Dados ---

class UserProfileDetailSerializer(serializers.ModelSerializer):
    """Serializer para exibir os detalhes do perfil do usuário."""
    foto = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        # O campo 'foto' será serializado como uma URL completa.
        fields = ('birth_date', 'educational_level', 'profession', 'focus', 'foto')

    def get_foto(self, obj):
        request = self.context.get('request')
        if obj.foto and request:
            return request.build_absolute_uri(obj.foto.url)
        return None


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer para exibir os detalhes do usuário, incluindo o perfil aninhado."""
    profile = UserProfileDetailSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'profile')
