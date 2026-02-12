# 🚀 GUIA: Atualizar Backend via AWS Console (Passo a Passo)

## 📝 PASSO A PASSO DETALHADO

### 1️⃣ Acesse o Console AWS

1. Abra seu navegador
2. Vá para: **https://console.aws.amazon.com**
3. Faça login com suas credenciais
4. Na barra de pesquisa, digite: **EC2**
5. Click em **EC2** (Elastic Compute Cloud)

---

### 2️⃣ Localize sua instância

1. No menu lateral esquerdo, click em **"Instances"** (Instâncias)
2. Procure pela instância: **i-0832ea4e8f50447ec**
   - Nome pode aparecer como: `skillio-backend` ou similar
   - IP Público: `54.227.194.67`
3. Click na checkbox ao lado da instância para selecioná-la

---

### 3️⃣ Conecte via navegador

1. Com a instância selecionada, click no botão **"Connect"** (laranja, no topo)
2. Na janela que abrir, você verá 4 abas
3. Click na aba **"EC2 Instance Connect"** (segunda aba)
4. Deixe o usuário como: **ubuntu**
5. Click no botão **"Connect"** (laranja)

**🎉 Uma nova aba/janela abrirá com um terminal preto!**

---

### 4️⃣ Execute os comandos de atualização

**Cole estes comandos no terminal (um de cada vez):**

#### Comando 1: Ir para a pasta do projeto
```bash
cd ~/Projeto_integrador
```
**Pressione Enter**

---

#### Comando 2: Configurar autenticação do Git (necessário uma única vez)

```bash
git config --global credential.helper store
```
**Pressione Enter**

---

#### Comando 3: Baixar as atualizações do GitHub

```bash
git pull origin Renan---AWS-Free-Tier
```

**Se pedir usuário e senha:**
- **Username:** `renaneliakim1`
- **Password:** Use um **Personal Access Token** (não a senha normal do GitHub)

**Como criar um Token:**
1. Abra: https://github.com/settings/tokens
2. Click em "Generate new token" → "Classic"
3. Nome: `Skillio Deploy`
4. Marque: `repo` (todos)
5. Click "Generate token"
6. **COPIE O TOKEN** (só aparece uma vez!)
7. Cole como "password" no terminal

---

#### Comando 4: Executar script de atualização

```bash
./deploy_scripts/update_backend.sh
```
**Pressione Enter**

**O script vai:**
- ✅ Ativar ambiente virtual Python
- ✅ Atualizar dependências
- ✅ Executar migrations do banco
- ✅ Coletar arquivos estáticos
- ✅ Reiniciar o serviço

**Aguarde 30-60 segundos...**

---

### 5️⃣ Verificar se funcionou

Após o script terminar, você deve ver algo como:

```
✅ Atualização concluída com sucesso!

📊 Status do serviço:
● skillio.service - Skillio Django API
   Loaded: loaded
   Active: active (running)
```

---

#### Comando 5: Testar a API (opcional)

```bash
curl http://localhost:8000/api/health/
```

Se responder algo como `{"status":"ok"}` ou similar, está funcionando! 🎉

---

### 6️⃣ Sair do terminal

```bash
exit
```

Pode fechar a aba do navegador.

---

## 🔍 TROUBLESHOOTING

### ❌ Se der erro "Permission denied" no git pull:

**Solução:** O servidor não tem acesso ao repositório privado.

**Configure token permanentemente:**

```bash
cd ~/Projeto_integrador
git remote set-url origin https://SEU_TOKEN_AQUI@github.com/renaneliakim1/Projeto_integrador.git
git pull
```

**Substitua `SEU_TOKEN_AQUI` pelo token que você criou**

---

### ❌ Se o script falhar:

**Ver logs do serviço:**
```bash
sudo journalctl -u skillio -n 50
```

**Reiniciar manualmente:**
```bash
sudo systemctl restart skillio
sudo systemctl status skillio
```

---

### ❌ Se não conseguir conectar via EC2 Instance Connect:

**Motivos possíveis:**
1. Instância está parada (verificar status)
2. Security Group bloqueando
3. Região errada selecionada (deve ser: us-east-2 / Ohio)

**Solução alternativa:**
Use o método de SSH tradicional (requer Git Bash ou WSL)

---

## ✅ APÓS A ATUALIZAÇÃO

**Testar a API:**
- http://54.227.194.67:8000
- http://54.227.194.67:8000/api/health/
- http://54.227.194.67:8000/admin

**Testar o Frontend:**
- https://d3lxa11agu4uln.cloudfront.net

**Ver logs em tempo real:**
```bash
sudo journalctl -u skillio -f
```
(Pressione Ctrl+C para sair)

---

## 📞 PRECISA DE AJUDA?

Se encontrar algum erro específico, copie a mensagem e me envie!

---

**Última atualização:** 12/02/2026
