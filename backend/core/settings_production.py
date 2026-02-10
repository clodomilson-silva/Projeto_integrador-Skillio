"""
Configurações de Produção para AWS
Sobrescreve settings.py com configurações otimizadas para produção
"""
from .settings import *
import os

# SEGURANÇA CRÍTICA
DEBUG = False
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

if not SECRET_KEY:
    raise ValueError("DJANGO_SECRET_KEY não configurada! Configure a variável de ambiente.")

# Domínios permitidos (ATUALIZE com seus domínios reais após criar os recursos AWS)
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    # Adicione aqui o IP público do EC2 após criar a instância
    # Exemplo: '3.123.45.67',
    # Adicione o domínio do CloudFront se configurar
    # Exemplo: 'd123456abcdef.cloudfront.net',
]

# CSRF e CORS (ATUALIZE após deploy)
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    # Adicione aqui a URL do S3 bucket após criar
    # Exemplo: 'https://skillio-frontend.s3-website-us-east-1.amazonaws.com',
    # Adicione o domínio do CloudFront se configurar
    # Exemplo: 'https://d123456abcdef.cloudfront.net',
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    # Adicione aqui a URL do S3 bucket após criar
    # Exemplo: 'https://skillio-frontend.s3-website-us-east-1.amazonaws.com',
    # Adicione o domínio do CloudFront se configurar
    # Exemplo: 'https://d123456abcdef.cloudfront.net',
]

CORS_ALLOW_CREDENTIALS = True

# Database AWS RDS PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'skillio_db'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # Conexões persistentes
        'OPTIONS': {
            'connect_timeout': 10,
        },
    }
}

# Static files com WhiteNoise (eficiente e grátis)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# WhiteNoise - Serve arquivos estáticos com compressão
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files - AWS S3 (opcional, pode usar local no EC2 também)
USE_S3_FOR_MEDIA = os.environ.get('USE_S3', 'FALSE') == 'TRUE'

if USE_S3_FOR_MEDIA:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = 'public-read'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
else:
    # Usar storage local do EC2
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Logging otimizado para produção
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Segurança adicional
SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'False') == 'True'
SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False') == 'True'
CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'False') == 'True'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Cache (opcional - pode adicionar Redis depois)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

print("🚀 Rodando em modo PRODUÇÃO")
print(f"📊 Database: {DATABASES['default']['HOST']}")
print(f"📁 Static: {STATIC_ROOT}")
print(f"🖼️  Media: S3" if USE_S3_FOR_MEDIA else f"🖼️  Media: {MEDIA_ROOT}")
