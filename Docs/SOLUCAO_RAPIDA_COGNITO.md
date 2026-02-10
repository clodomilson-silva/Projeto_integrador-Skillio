# SOLUÇÃO RÁPIDA - AWS Cognito Client Secret

## ⚠️ PROBLEMA ATUAL

O App Client `2mo1h27i701da8mp3rpdf6c8gb` está configurado para **exigir Client Secret**, mas você não o configurou no `.env`.

## 🚀 SOLUÇÃO MAIS RÁPIDA (Criar novo App Client SEM Client Secret)

### Passo 1: Acesse o AWS Cognito Console
https://us-east-1.console.aws.amazon.com/cognito/v2/idp/user-pools/us-east-1_dPfKhXGMQ/app-integration/clients

### Passo 2: Criar um novo App Client
1. Clique em **"Create app client"**
2. Configure:
   - **App client name**: `skillio-web-public` (ou qualquer nome)
   - **App type**: Selecione **"Public client"** (não precisa de client secret)
   - **Authentication flows**: Marque:
     - ✅ ALLOW_USER_PASSWORD_AUTH
     - ✅ ALLOW_REFRESH_TOKEN_AUTH
     - ✅ ALLOW_USER_SRP_AUTH (opcional)

### Passo 3: Copie o novo Client ID
Após criar, copie o **Client ID** (será algo como `6abc123def456ghi789jkl`)

### Passo 4: Atualize o .env
Abra `backend/.env` e substitua:

```env
AWS_COGNITO_APP_CLIENT_ID=2mo1h27i701da8mp3rpdf6c8gb
AWS_COGNITO_APP_CLIENT_SECRET=
```

Por:

```env
AWS_COGNITO_APP_CLIENT_ID=SEU_NOVO_CLIENT_ID_AQUI
# AWS_COGNITO_APP_CLIENT_SECRET não é necessário para Public clients
```

### Passo 5: Reinicie o servidor
```powershell
# Pare o servidor (Ctrl+C no terminal)
# Inicie novamente:
python manage.py runserver 192.168.205.202:8000
```

---

## 🔐 ALTERNATIVA: Obter o Client Secret do App Client Atual

Se preferir manter o App Client atual, você precisa do Client Secret:

1. Vá para: https://us-east-1.console.aws.amazon.com/cognito/v2/idp/user-pools/us-east-1_dPfKhXGMQ/app-integration/clients/2mo1h27i701da8mp3rpdf6c8gb
2. Clique em **"Show client secret"**
3. Copie o secret
4. Cole no `.env`:
   ```env
   AWS_COGNITO_APP_CLIENT_SECRET=o_secret_que_voce_copiou
   ```
5. Reinicie o servidor

---

## ✅ Como testar se funcionou

Após fazer uma das soluções acima:

1. Recarregue a página do frontend (F5)
2. Tente fazer reset de senha novamente
3. Se funcionar, você verá no console do Django:
   ```
   "GET /api/v1/auth/forgot-password/ HTTP/1.1" 200
   ```

---

## 📝 Recomendação

Para aplicações web (React/Angular/Vue), **sempre use Public clients** (sem Client Secret), pois o código JavaScript é público e não pode guardar segredos com segurança.
