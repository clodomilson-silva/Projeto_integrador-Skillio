# ✅ Checklist de Teste - Recuperação de Senha

Use este checklist para validar que a implementação está funcionando corretamente.

---

## 🔧 Pré-requisitos

Antes de testar, certifique-se de que:

- [ ] AWS Cognito User Pool foi criado
- [ ] IAM User foi criado com permissões corretas
- [ ] Variáveis de ambiente estão configuradas no `.env`
- [ ] Dependências foram instaladas (`pip install -r requirements.txt`)
- [ ] Backend está rodando (`python manage.py runserver`)
- [ ] Frontend está rodando (`npm run dev`)
- [ ] Usuário de teste foi criado no Cognito com email verificado

---

## 🧪 Testes Funcionais

### 1. Página "Esqueci minha senha"

#### Acesso
- [ ] Acessar http://localhost:5173/login
- [ ] Clicar no link "Esqueceu sua senha?"
- [ ] Ser redirecionado para `/forgot-password`

#### UI/Layout
- [ ] Logo do Skillio está visível
- [ ] Título "Recuperar Senha" está correto
- [ ] Campo de email está presente
- [ ] Botão "Enviar Código" está visível
- [ ] Link "Voltar para o login" funciona
- [ ] Página é responsiva (testar em mobile)
- [ ] Dark mode funciona corretamente

#### Validações Frontend
- [ ] Campo vazio: Mostra erro "Campo obrigatório"
- [ ] Email inválido (sem @): Mostra erro "Email inválido"
- [ ] Email inválido (sem domínio): Mostra erro "Email inválido"

#### Funcionalidade
- [ ] Digitar email válido e clicar "Enviar Código"
- [ ] Ver spinner de loading durante o envio
- [ ] Ver mensagem de sucesso após envio
- [ ] Ser redirecionado para `/reset-password` automaticamente
- [ ] Email recebido na caixa de entrada (aguardar 1-2 min)
- [ ] Email contém código de 6 dígitos
- [ ] Email não está na pasta de spam

### 2. Página "Redefinir Senha"

#### Acesso Direto
- [ ] Acessar http://localhost:5173/reset-password
- [ ] Página carrega corretamente

#### Acesso Via Forgot Password
- [ ] Vir da página anterior com email já preenchido
- [ ] Campo de email está preenchido automaticamente

#### UI/Layout
- [ ] Ícone de cadeado está visível
- [ ] Título "Redefinir Senha" está correto
- [ ] 4 campos visíveis: email, código, senha, confirmar senha
- [ ] Botão "Reenviar código" está presente
- [ ] Botão "Redefinir Senha" está visível
- [ ] Links de navegação funcionam
- [ ] Página é responsiva
- [ ] Dark mode funciona

#### Campo de Código
- [ ] Aceita apenas números
- [ ] Limita a 6 dígitos
- [ ] Texto centralizado e grande
- [ ] Não aceita letras ou símbolos

#### Campos de Senha
- [ ] Botão de mostrar/ocultar senha funciona
- [ ] Ambos os campos têm o botão de olho
- [ ] Senhas ficam ocultas por padrão

#### Validações Frontend
- [ ] Campos vazios: Mostra erro
- [ ] Código com menos de 6 dígitos: Mostra erro
- [ ] Senhas não coincidem: Mostra erro
- [ ] Senha com menos de 8 caracteres: Mostra erro

#### Funcionalidade - Reenviar Código
- [ ] Clicar em "Reenviar código"
- [ ] Ver spinner no botão
- [ ] Ver mensagem de sucesso
- [ ] Receber novo código por email

#### Funcionalidade - Redefinir Senha
- [ ] Preencher todos os campos corretamente
- [ ] Clicar em "Redefinir Senha"
- [ ] Ver spinner durante o processo
- [ ] Ver tela de sucesso (ícone verde, mensagem)
- [ ] Ser redirecionado para login automaticamente
- [ ] Redirecionamento acontece em 3 segundos

### 3. Testar Nova Senha

#### Login com Nova Senha
- [ ] Ser redirecionado para `/login`
- [ ] Digitar email e NOVA senha
- [ ] Conseguir fazer login com sucesso
- [ ] Ser redirecionado para dashboard

#### Confirmar que Senha Antiga Não Funciona
- [ ] Tentar login com senha antiga
- [ ] Ver mensagem de erro "Credenciais inválidas"

---

## 🚨 Testes de Erro

### Erros de Código

#### Código Inválido
- [ ] Digitar código errado (ex: 000000)
- [ ] Clicar em "Redefinir Senha"
- [ ] Ver erro "Código de verificação inválido"

#### Código Expirado
- [ ] Aguardar 1 hora após solicitar código
- [ ] Tentar usar código antigo
- [ ] Ver erro "Código expirado"
- [ ] Solicitar novo código funciona

#### Muitas Tentativas
- [ ] Tentar código errado várias vezes (5+)
- [ ] Ver erro "Muitas tentativas. Aguarde alguns minutos"
- [ ] Aguardar e tentar novamente

### Erros de Email

#### Email Não Cadastrado
- [ ] Digitar email que não existe no sistema
- [ ] Clicar "Enviar Código"
- [ ] Ver mensagem genérica (não revela se existe)
- [ ] Não receber email

#### Email Inválido
- [ ] Digitar email sem @
- [ ] Ver erro de validação antes de enviar
- [ ] Digitar email sem domínio
- [ ] Ver erro de validação

### Erros de Senha

#### Senha Muito Curta
- [ ] Digitar senha com 7 caracteres
- [ ] Ver erro "Senha deve ter no mínimo 8 caracteres"

#### Senha Sem Requisitos
- [ ] Digitar senha sem maiúscula (ex: senha123)
- [ ] Ver erro do backend sobre requisitos

#### Senhas Diferentes
- [ ] Digitar senhas diferentes nos dois campos
- [ ] Ver erro "Senhas não coincidem"

---

## 🌐 Testes de API (Opcional)

### Testar com cURL/Postman

#### Endpoint: Forgot Password
```bash
curl -X POST http://localhost:8000/api/auth/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
- [ ] Status 200
- [ ] JSON com "message"

#### Endpoint: Reset Password
```bash
curl -X POST http://localhost:8000/api/auth/reset-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "new_password": "NovaSenha123!"
  }'
```
- [ ] Status 200 (código correto)
- [ ] Status 400 (código incorreto)

#### Endpoint: Resend Code
```bash
curl -X POST http://localhost:8000/api/auth/resend-code/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
- [ ] Status 200
- [ ] Novo email recebido

---

## 📱 Testes de Responsividade

### Mobile (< 640px)
- [ ] Abrir em celular ou DevTools mobile
- [ ] Todos os elementos se ajustam
- [ ] Texto legível sem zoom
- [ ] Botões grandes o suficiente para tocar
- [ ] Campos de formulário acessíveis

### Tablet (640px - 1024px)
- [ ] Layout se adapta corretamente
- [ ] Espaçamento adequado

### Desktop (> 1024px)
- [ ] Centralizado corretamente
- [ ] Largura máxima respeitada (max-w-md)

---

## 🎨 Testes Visuais

### Light Mode
- [ ] Cores adequadas
- [ ] Contraste suficiente
- [ ] Ícones visíveis

### Dark Mode
- [ ] Alternar para dark mode
- [ ] Cores se adaptam
- [ ] Texto legível
- [ ] Ícones visíveis
- [ ] Cards com backdrop blur

### Animações
- [ ] Spinner de loading aparece
- [ ] Transições suaves nos botões
- [ ] Hover states funcionam

---

## 🔒 Testes de Segurança

### Frontend
- [ ] Credenciais AWS não estão no código
- [ ] Senhas não aparecem no console
- [ ] Tokens não são logados

### Backend
- [ ] `.env` não está no Git
- [ ] Credenciais AWS estão em variáveis de ambiente
- [ ] Erros não revelam informações sensíveis
- [ ] Rate limiting funciona (Cognito)

---

## ⚡ Testes de Performance

### Tempo de Resposta
- [ ] Solicitar código: < 3 segundos
- [ ] Redefinir senha: < 3 segundos
- [ ] Reenviar código: < 3 segundos

### Loading States
- [ ] Loading aparece imediatamente ao clicar
- [ ] Botões ficam desabilitados durante loading
- [ ] Campos ficam desabilitados durante loading

---

## 🌍 Testes de Navegação

### Links
- [ ] "Voltar para login" funciona (ambas as páginas)
- [ ] "Fazer login" redireciona corretamente
- [ ] "Esqueceu sua senha?" no login funciona
- [ ] Navegação com botão "Voltar" do navegador funciona

### Estado
- [ ] Email é mantido entre páginas (state)
- [ ] Refresh da página não quebra
- [ ] Estado limpo após sucesso

---

## 🐛 Testes de Edge Cases

### Casos Extremos
- [ ] Email muito longo (100+ caracteres)
- [ ] Senha muito longa (100+ caracteres)
- [ ] Caracteres especiais no email
- [ ] Emoji na senha (deve funcionar)
- [ ] Espaços no início/fim do email (trimmed)
- [ ] Enter no campo de email submete o form
- [ ] Enter no campo de código submete o form

### Conexão
- [ ] Desconectar internet e tentar
- [ ] Ver erro de rede apropriado
- [ ] Reconectar e funcionar normalmente

---

## 📊 Resumo de Testes

Total de testes: **100+**

### Por Categoria
- ✅ Funcionais: 40+
- ✅ UI/UX: 20+
- ✅ Erro: 15+
- ✅ API: 5+
- ✅ Responsividade: 5+
- ✅ Visual: 10+
- ✅ Segurança: 5+
- ✅ Performance: 5+
- ✅ Navegação: 5+
- ✅ Edge Cases: 10+

---

## ✅ Critérios de Aceitação

Para considerar a funcionalidade pronta para produção:

### Obrigatório (Must Have)
- [x] Todos os testes funcionais passam
- [x] Validações funcionam corretamente
- [x] Emails são recebidos
- [x] Senha é alterada com sucesso
- [x] Erros são tratados adequadamente
- [x] UI é responsiva
- [x] Segurança implementada

### Desejável (Nice to Have)
- [ ] Testes automatizados escritos
- [ ] Amazon SES configurado (em vez de Cognito Email)
- [ ] Monitoramento em CloudWatch
- [ ] Analytics de uso

### Opcional (Could Have)
- [ ] Rate limiting adicional no frontend
- [ ] Captcha para múltiplas tentativas
- [ ] SMS como opção de recuperação
- [ ] Perguntas de segurança

---

## 🎯 Próximos Passos

Após concluir todos os testes:

1. [ ] Marcar todos os checkboxes acima
2. [ ] Documentar bugs encontrados
3. [ ] Corrigir bugs críticos
4. [ ] Testar correções
5. [ ] Deploy em staging
6. [ ] Testar em staging
7. [ ] Deploy em produção
8. [ ] Monitorar produção

---

## 📝 Notas de Teste

Use este espaço para anotar observações durante os testes:

### Bugs Encontrados
```
- Bug 1: [Descrição]
- Bug 2: [Descrição]
```

### Melhorias Sugeridas
```
- Melhoria 1: [Descrição]
- Melhoria 2: [Descrição]
```

### Observações
```
- Observação 1: [Descrição]
- Observação 2: [Descrição]
```

---

**Data do Teste**: __________  
**Testador**: __________  
**Ambiente**: [ ] Desenvolvimento [ ] Staging [ ] Produção  
**Status**: [ ] Aprovado [ ] Reprovado [ ] Pendente

---

_Este checklist garante que a funcionalidade de recuperação de senha foi testada completamente._
