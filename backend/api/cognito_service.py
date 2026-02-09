"""
Serviço para integração com AWS Cognito.
Gerencia autenticação, registro e recuperação de senha.
"""
import boto3
from django.conf import settings
from botocore.exceptions import ClientError
import logging
import hmac
import hashlib
import base64

logger = logging.getLogger(__name__)


class CognitoService:
    """Serviço para interagir com AWS Cognito User Pool"""
    
    def __init__(self):
        """Inicializa o cliente Cognito com as configurações do Django"""
        self.region_name = getattr(settings, 'AWS_COGNITO_REGION', 'us-east-1')
        self.user_pool_id = getattr(settings, 'AWS_COGNITO_USER_POOL_ID', None)
        self.client_id = getattr(settings, 'AWS_COGNITO_APP_CLIENT_ID', None)
        self.client_secret = getattr(settings, 'AWS_COGNITO_APP_CLIENT_SECRET', None)
        self.aws_access_key_id = getattr(settings, 'AWS_ACCESS_KEY_ID', None)
        self.aws_secret_access_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
        
        # DEBUG: Log temporário para verificar se o client_secret está sendo carregado
        logger.info(f"=== COGNITO INIT DEBUG ===")
        logger.info(f"Client Secret configurado: {'Sim' if self.client_secret else 'Não'}")
        logger.info(f"Tamanho do Client Secret: {len(self.client_secret) if self.client_secret else 0}")
        logger.info(f"=========================")
        
        # Validar configurações
        if not all([self.client_id, self.user_pool_id, self.aws_access_key_id, self.aws_secret_access_key]):
            logger.warning(
                "AWS Cognito não configurado corretamente. Verifique as variáveis de ambiente:\n"
                f"AWS_COGNITO_REGION: {'✓' if self.region_name else '✗'}\n"
                f"AWS_COGNITO_USER_POOL_ID: {'✓' if self.user_pool_id else '✗'}\n"
                f"AWS_COGNITO_APP_CLIENT_ID: {'✓' if self.client_id else '✗'}\n"
                f"AWS_COGNITO_APP_CLIENT_SECRET: {'✓' if self.client_secret else '✗ (Opcional)'}\n"
                f"AWS_ACCESS_KEY_ID: {'✓' if self.aws_access_key_id else '✗'}\n"
                f"AWS_SECRET_ACCESS_KEY: {'✓' if self.aws_secret_access_key else '✗'}"
            )
        
        try:
            self.client = boto3.client(
                'cognito-idp',
                region_name=self.region_name,
                aws_access_key_id=self.aws_access_key_id,
                aws_secret_access_key=self.aws_secret_access_key
            )
        except Exception as e:
            logger.error(f"Erro ao inicializar cliente Cognito: {str(e)}")
            self.client = None
    
    def _get_secret_hash(self, username):
        """
        Calcula o SECRET_HASH necessário quando o App Client tem client secret.
        
        Args:
            username (str): Email ou username do usuário
            
        Returns:
            str: SECRET_HASH calculado ou None se não houver client secret
        """
        if not self.client_secret:
            return None
        
        message = bytes(username + self.client_id, 'utf-8')
        secret = bytes(self.client_secret, 'utf-8')
        dig = hmac.new(secret, message, digestmod=hashlib.sha256).digest()
        return base64.b64encode(dig).decode()
    
    def forgot_password(self, username):
        """
        Inicia o processo de recuperação de senha.
        Envia um código de verificação para o email do usuário.
        
        Args:
            username (str): Email ou username do usuário
            
        Returns:
            dict: Resposta do Cognito com delivery details
            
        Raises:
            Exception: Se houver erro na operação
        """
        # Verificar se o Cognito está configurado
        if not self.client:
            logger.error("Cliente Cognito não está inicializado")
            return {
                'success': False,
                'message': 'Serviço de recuperação de senha não está configurado. Contate o administrador.'
            }
        
        if not self.client_id:
            logger.error("AWS_COGNITO_APP_CLIENT_ID não configurado")
            return {
                'success': False,
                'message': 'Serviço de recuperação de senha não está configurado corretamente.'
            }
        
        try:
            # Preparar parâmetros da requisição
            params = {
                'ClientId': self.client_id,
                'Username': username
            }
            
            # Adicionar SECRET_HASH se o client secret estiver configurado
            secret_hash = self._get_secret_hash(username)
            if secret_hash:
                params['SecretHash'] = secret_hash
            
            response = self.client.forgot_password(**params)
            logger.info(f"Código de recuperação enviado para {username}")
            return {
                'success': True,
                'message': 'Código de verificação enviado para seu email.',
                'delivery': response.get('CodeDeliveryDetails', {})
            }
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error'].get('Message', '')
            logger.error(f"Erro ao enviar código de recuperação: {error_code} - {error_message}")
            
            # Verificar se o erro é por falta de SECRET_HASH
            if 'SECRET_HASH' in error_message:
                logger.error("ERRO: App Client requer SECRET_HASH mas AWS_COGNITO_APP_CLIENT_SECRET não está configurado")
                return {
                    'success': False,
                    'message': 'Configuração incompleta. O App Client requer um Client Secret. Consulte o arquivo backend/SOLUCAO_RAPIDA_COGNITO.md ou contate o administrador.'
                }
            
            if error_code == 'UserNotFoundException':
                # Por segurança, não revelamos se o usuário existe ou não
                return {
                    'success': True,
                    'message': 'Se este email estiver cadastrado, você receberá um código de verificação.'
                }
            elif error_code == 'InvalidParameterException':
                # Verificar se é erro de email não verificado
                if 'no registered/verified email' in error_message:
                    return {
                        'success': False,
                        'message': 'Este email não está registrado ou verificado no sistema. Por favor, cadastre-se primeiro ou verifique seu email.'
                    }
                return {
                    'success': False,
                    'message': 'Email inválido.'
                }
            elif error_code == 'LimitExceededException':
                return {
                    'success': False,
                    'message': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
                }
            else:
                logger.error(f"Erro desconhecido: {error_code} - {error_message}")
                return {
                    'success': False,
                    'message': f'Erro ao processar solicitação: {error_message}'
                }
        except Exception as e:
            logger.error(f"Erro inesperado ao enviar código: {str(e)}")
            return {
                'success': False,
                'message': f'Erro inesperado: {str(e)}'
            }
    
    def confirm_forgot_password(self, username, confirmation_code, new_password):
        """
        Confirma a recuperação de senha com o código recebido.
        
        Args:
            username (str): Email ou username do usuário
            confirmation_code (str): Código de 6 dígitos recebido por email
            new_password (str): Nova senha do usuário
            
        Returns:
            dict: Resposta indicando sucesso ou erro
        """
        try:
            # Preparar parâmetros da requisição
            params = {
                'ClientId': self.client_id,
                'Username': username,
                'ConfirmationCode': confirmation_code,
                'Password': new_password
            }
            
            # Adicionar SECRET_HASH se o client secret estiver configurado
            secret_hash = self._get_secret_hash(username)
            if secret_hash:
                params['SecretHash'] = secret_hash
            
            self.client.confirm_forgot_password(**params)
            logger.info(f"Senha redefinida com sucesso para {username}")
            return {
                'success': True,
                'message': 'Senha redefinida com sucesso!'
            }
        except ClientError as e:
            error_code = e.response['Error']['Code']
            logger.error(f"Erro ao confirmar recuperação: {error_code}")
            
            if error_code == 'CodeMismatchException':
                return {
                    'success': False,
                    'message': 'Código de verificação inválido.'
                }
            elif error_code == 'ExpiredCodeException':
                return {
                    'success': False,
                    'message': 'Código expirado. Solicite um novo código.'
                }
            elif error_code == 'InvalidPasswordException':
                return {
                    'success': False,
                    'message': 'A senha não atende aos requisitos de segurança.'
                }
            elif error_code == 'LimitExceededException':
                return {
                    'success': False,
                    'message': 'Muitas tentativas. Aguarde alguns minutos.'
                }
            else:
                return {
                    'success': False,
                    'message': 'Erro ao redefinir senha. Tente novamente.'
                }
    
    def resend_confirmation_code(self, username):
        """
        Reenvia o código de confirmação.
        
        Args:
            username (str): Email ou username do usuário
            
        Returns:
            dict: Resposta indicando sucesso ou erro
        """
        try:
            # Preparar parâmetros da requisição
            params = {
                'ClientId': self.client_id,
                'Username': username
            }
            
            # Adicionar SECRET_HASH se o client secret estiver configurado
            secret_hash = self._get_secret_hash(username)
            if secret_hash:
                params['SecretHash'] = secret_hash
            
            response = self.client.resend_confirmation_code(**params)
            return {
                'success': True,
                'message': 'Novo código enviado para seu email.',
                'delivery': response.get('CodeDeliveryDetails', {})
            }
        except ClientError as e:
            error_code = e.response['Error']['Code']
            logger.error(f"Erro ao reenviar código: {error_code}")
            return {
                'success': False,
                'message': 'Erro ao reenviar código. Tente novamente.'
            }


# Instância global do serviço
cognito_service = CognitoService()
