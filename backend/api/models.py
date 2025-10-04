from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Modelo para armazenar informações adicionais do usuário,
    complementando o modelo User padrão do Django.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    birth_date = models.DateField(null=True, blank=True)
    educational_level = models.CharField(max_length=50, blank=True)
    profession = models.CharField(max_length=100, blank=True)
    focus = models.CharField(max_length=100, blank=True)
    terms_accepted = models.BooleanField(default=False)
    foto = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
