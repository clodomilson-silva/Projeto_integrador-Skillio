# Como Obter o AWS Cognito Client Secret

O erro que você está vendo indica que o App Client do AWS Cognito está configurado com um **Client Secret**, mas ele não está sendo enviado nas requisições.

## Opção 1: Obter o Client Secret (Recomendado para agora)

1. **Acesse o Console AWS**: https://console.aws.amazon.com/cognito
2. **Selecione sua região**: `us-east-1` (conforme seu .env)
3. **Clique em "User Pools"**
4. **Selecione seu User Pool**: `us-east-1_dPfKhXGMQ`
5. **Vá em "App integration" → "App clients"**
6. **Encontre o App Client**: `2mo1h27i701da8mp3rpdf6c8gb`
7. **Clique em "Show client secret"** ou "View details"
8. **Copie o Client Secret**
9. **Cole no arquivo `.env`**: 
   ```
   AWS_COGNITO_APP_CLIENT_SECRET=cole_o_secret_aqui
   ```

## Opção 2: Desabilitar o Client Secret (Recomendado para aplicações web públicas)

Se você tem acesso para modificar o App Client:

1. Acesse o mesmo App Client no console
2. Clique em **"Edit"**
3. Em **"Authentication flows"**, certifique-se de que **"Enable username password auth for admin APIs (ALLOW_ADMIN_USER_PASSWORD_AUTH)"** está marcado
4. **DESMARQUE** a opção de usar Client Secret (ou crie um novo App Client sem Client Secret)
5. Salve as alterações

⚠️ **Nota**: Para aplicações web públicas (como SPAs - React, Angular, Vue), é recomendado **NÃO usar Client Secret**, pois o código JavaScript é visível no navegador.

## Testando após configurar

Após adicionar o `AWS_COGNITO_APP_CLIENT_SECRET` no `.env`, reinicie o servidor:

```bash
cd backend
python manage.py runserver
```

Depois teste novamente o reset de senha no frontend.

## Status Atual

✓ O código já foi atualizado para calcular o SECRET_HASH automaticamente
✓ Você só precisa adicionar o Client Secret no arquivo `.env`
✓ Ou criar um novo App Client sem Client Secret no AWS Cognito
