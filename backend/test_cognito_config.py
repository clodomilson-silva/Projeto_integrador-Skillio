"""
Script para testar a configuração do AWS Cognito
"""
import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from api.cognito_service import cognito_service


def test_cognito_config():
    """Testa se as configurações do Cognito estão corretas"""
    print("=" * 60)
    print("TESTANDO CONFIGURAÇÃO DO AWS COGNITO")
    print("=" * 60)
    
    # Verificar variáveis de ambiente
    print("\n1. VARIÁVEIS DE AMBIENTE:")
    print("-" * 60)
    
    configs = {
        'AWS_COGNITO_REGION': getattr(settings, 'AWS_COGNITO_REGION', None),
        'AWS_COGNITO_USER_POOL_ID': getattr(settings, 'AWS_COGNITO_USER_POOL_ID', None),
        'AWS_COGNITO_APP_CLIENT_ID': getattr(settings, 'AWS_COGNITO_APP_CLIENT_ID', None),
        'AWS_COGNITO_APP_CLIENT_SECRET': getattr(settings, 'AWS_COGNITO_APP_CLIENT_SECRET', None),
        'AWS_ACCESS_KEY_ID': getattr(settings, 'AWS_ACCESS_KEY_ID', None),
        'AWS_SECRET_ACCESS_KEY': getattr(settings, 'AWS_SECRET_ACCESS_KEY', None),
    }
    
    all_set = True
    for key, value in configs.items():
        if value and len(str(value)) > 0:
            # Ocultar valores sensíveis
            if 'KEY' in key or 'SECRET' in key:
                display_value = f"{str(value)[:10]}...{str(value)[-4:]}" if len(str(value)) > 14 else "***"
            elif 'POOL_ID' in key or 'CLIENT_ID' in key:
                display_value = f"{str(value)[:15]}..." if len(str(value)) > 15 else str(value)
            else:
                display_value = str(value)
            print(f"✓ {key}: {display_value}")
        else:
            print(f"✗ {key}: NÃO CONFIGURADO")
            all_set = False
    
    print("\n2. CLIENTE COGNITO:")
    print("-" * 60)
    if cognito_service.client:
        print("✓ Cliente Cognito inicializado com sucesso")
    else:
        print("✗ ERRO: Cliente Cognito não foi inicializado")
        print("   Verifique se as credenciais AWS estão corretas no arquivo .env")
        all_set = False
    
    print("\n3. RESUMO:")
    print("-" * 60)
    
    # Verificar se o client secret está configurado
    has_client_secret = cognito_service.client_secret and len(str(cognito_service.client_secret)) > 0
    
    if has_client_secret:
        print("⚠️  ATENÇÃO: App Client usa Client Secret")
        print("   O SECRET_HASH será calculado automaticamente nas requisições.")
    else:
        print("⚠️  AVISO: AWS_COGNITO_APP_CLIENT_SECRET não está configurado!")
        print("   Se o App Client do Cognito exigir Client Secret, as requisições falharão.")
        print("   Consulte: backend/GET_CLIENT_SECRET.md")
        print()
    
    if all_set and cognito_service.client:
        if has_client_secret:
            print("✓ Configuração completa! O serviço de reset de senha está pronto.")
        else:
            print("⚠️  Configuração parcialmente completa.")
            print("   Se encontrar erro 'SECRET_HASH was not received', configure o Client Secret.")
    else:
        print("✗ CONFIGURAÇÃO INCOMPLETA")
        print("\nPara configurar:")
        print("1. Abra o arquivo backend/.env")
        print("2. Verifique se todas as variáveis AWS_COGNITO_* estão preenchidas")
        print("3. Certifique-se de que as credenciais AWS estão corretas")
        print("4. Se necessário, adicione AWS_COGNITO_APP_CLIENT_SECRET")
    
    print("=" * 60)
    return all_set


if __name__ == '__main__':
    test_cognito_config()
