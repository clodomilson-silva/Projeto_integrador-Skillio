"""
Script de teste para verificar envio de email via EmailJS
"""
import os
import requests
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def test_email_send():
    """Testa o envio de email via EmailJS API"""
    
    # Obter credenciais
    service_id = os.environ.get('EMAILJS_SERVICE_ID')
    template_id = os.environ.get('EMAILJS_TEMPLATE_ID')
    user_id = os.environ.get('EMAILJS_USER_ID')
    
    print("=" * 60)
    print("🧪 TESTE DE ENVIO DE EMAIL VIA EMAILJS")
    print("=" * 60)
    
    # Verificar se as credenciais existem
    print("\n📋 Verificando credenciais:")
    print(f"   Service ID: {service_id if service_id else '❌ NÃO ENCONTRADO'}")
    print(f"   Template ID: {template_id if template_id else '❌ NÃO ENCONTRADO'}")
    print(f"   User ID: {user_id if user_id else '❌ NÃO ENCONTRADO'}")
    
    if not all([service_id, template_id, user_id]):
        print("\n❌ Erro: Credenciais incompletas no arquivo .env")
        return False
    
    # Email de teste
    test_email = input("\n📧 Digite o email para teste (ou Enter para usar renaneliakim1@gmail.com): ").strip()
    if not test_email:
        test_email = "renaneliakim1@gmail.com"
    
    test_code = "123456"  # Código de teste
    
    print(f"\n📤 Enviando email de teste para: {test_email}")
    print(f"   Código de teste: {test_code}")
    
    # Preparar dados do email
    email_data = {
        'service_id': service_id,
        'template_id': template_id,
        'user_id': user_id,
        'template_params': {
            'to_email': test_email,
            'to_name': 'Usuário Teste',
            'reset_code': test_code,
            'message': f'Seu código de recuperação de senha é: {test_code}\n\nEste código é válido por 10 minutos.'
        }
    }
    
    try:
        # Fazer requisição para API do EmailJS
        print("\n⏳ Enviando requisição para EmailJS...")
        response = requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            json=email_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\n📊 Status da resposta: {response.status_code}")
        
        if response.status_code == 200:
            print("\n✅ EMAIL ENVIADO COM SUCESSO!")
            print(f"   Verifique a caixa de entrada de: {test_email}")
            print(f"   (Também verifique a pasta de spam)")
            return True
        else:
            print(f"\n❌ ERRO AO ENVIAR EMAIL")
            print(f"   Status Code: {response.status_code}")
            print(f"   Resposta: {response.text}")
            
            # Diagnóstico de erros comuns
            if response.status_code == 400:
                print("\n🔍 Possíveis causas:")
                print("   - Template ID incorreto ou não existe")
                print("   - Campos do template não correspondem aos enviados")
                print("   - Service ID incorreto")
            elif response.status_code == 401:
                print("\n🔍 Possíveis causas:")
                print("   - User ID (Public Key) incorreto ou inválido")
            elif response.status_code == 403:
                print("\n🔍 Possíveis causas:")
                print("   - Conta EmailJS bloqueada ou limite excedido")
            
            return False
            
    except requests.exceptions.Timeout:
        print("\n❌ TIMEOUT: A requisição demorou muito para responder")
        return False
    except requests.exceptions.ConnectionError:
        print("\n❌ ERRO DE CONEXÃO: Não foi possível conectar à API do EmailJS")
        print("   Verifique sua conexão com a internet")
        return False
    except Exception as e:
        print(f"\n❌ ERRO INESPERADO: {str(e)}")
        return False

if __name__ == "__main__":
    try:
        success = test_email_send()
        print("\n" + "=" * 60)
        if success:
            print("✅ TESTE CONCLUÍDO COM SUCESSO")
            print("\n💡 Próximos passos:")
            print("   1. Verifique o email recebido")
            print("   2. Teste o fluxo completo no frontend")
            print("   3. Se não recebeu, verifique o template no dashboard EmailJS")
        else:
            print("❌ TESTE FALHOU")
            print("\n🔧 Como resolver:")
            print("   1. Acesse: https://dashboard.emailjs.com/")
            print("   2. Verifique se o Service está ativo")
            print("   3. Verifique se o Template existe e está configurado")
            print("   4. Confira se as credenciais no .env estão corretas")
        print("=" * 60)
    except KeyboardInterrupt:
        print("\n\n⚠️  Teste cancelado pelo usuário")
