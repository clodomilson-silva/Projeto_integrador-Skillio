# 🐳 SKILLIO - Guia Docker Completo

## 📋 Índice
- [Pré-requisitos](#pré-requisitos)
- [Estrutura](#estrutura)
- [Configuração Inicial](#configuração-inicial)
- [Comandos Principais](#comandos-principais)
- [Serviços Disponíveis](#serviços-disponíveis)
- [Volumes e Persistência](#volumes-e-persistência)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Pré-requisitos

- **Docker Desktop** instalado e rodando
  - Windows/Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)
- **Docker Compose** (já incluído no Docker Desktop)
- **Mínimo 4GB RAM** disponível para os containers
- **5GB de espaço em disco** livre

---

## 📁 Estrutura

```
Projeto_integrador/
├── docker-compose.yml          # Orquestração dos containers
├── .env.example                # Template de variáveis de ambiente
├── .env                        # Suas configurações (criar a partir do .env.example)
│
├── backend/
│   ├── Dockerfile              # Imagem do Django
│   └── .dockerignore
│
├── Frontend/
│   ├── Dockerfile              # Imagem do React/Vite
│   └── .dockerignore
│
├── nginx/
│   ├── nginx.conf              # Configuração principal do Nginx
│   └── conf.d/
│       └── skillio.conf        # Configuração do Skillio
│
├── backup/                     # Backups do banco de dados
│
└── Scripts de gerenciamento:
    ├── docker-init.bat         # Inicialização completa (Windows)
    ├── docker-init.sh          # Inicialização completa (Linux/Mac)
    ├── docker-stop.bat         # Parar containers
    ├── docker-restart.bat      # Reiniciar containers
    ├── docker-logs.bat         # Ver logs em tempo real
    ├── docker-status.bat       # Status dos serviços
    ├── docker-backup.bat       # Backup do banco de dados
    └── docker-clean.bat        # Limpeza completa
```

---

## ⚙️ Configuração Inicial

### 1. Clone o repositório e entre na pasta
```bash
cd Projeto_integrador
```

### 2. Configure as variáveis de ambiente

**Windows:**
```bash
copy .env.example .env
notepad .env
```

**Linux/Mac:**
```bash
cp .env.example .env
nano .env
```

Preencha as variáveis obrigatórias:
- `GOOGLE_API_KEY` - Para IA Generativa
- `VITE_YOUTUBE_API_KEY` - Para vídeos do YouTube
- Outras APIs conforme necessário

### 3. Execute a inicialização

**Windows:**
```bash
docker-init.bat
```

**Linux/Mac:**
```bash
chmod +x docker-init.sh
./docker-init.sh
```

Aguarde alguns minutos para:
- ✅ Download das imagens base
- ✅ Build dos containers
- ✅ Inicialização dos serviços
- ✅ Migrations do banco de dados

---

## 🎯 Comandos Principais

### Windows

| Comando | Descrição |
|---------|-----------|
| `docker-init.bat` | Inicialização completa (build + start) |
| `docker-stop.bat` | Para todos os containers |
| `docker-restart.bat` | Reinicia todos os containers |
| `docker-logs.bat` | Acompanha logs em tempo real |
| `docker-status.bat` | Status detalhado dos serviços |
| `docker-backup.bat` | Cria backup do banco de dados |
| `docker-clean.bat` | Remove tudo (containers, volumes, imagens) |

### Docker Compose (Multiplataforma)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose stop

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Reiniciar um serviço específico
docker-compose restart backend

# Ver status
docker-compose ps

# Executar comando em um container
docker-compose exec backend python manage.py createsuperuser

# Reconstruir imagens
docker-compose build --no-cache

# Parar e remover tudo
docker-compose down

# Parar e remover incluindo volumes
docker-compose down -v
```

---

## 🌐 Serviços Disponíveis

Após inicialização bem-sucedida:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend (Nginx)** | http://localhost | Aplicação React via Nginx |
| **Frontend (Direto)** | http://localhost:5173 | Vite Dev Server (HMR ativo) |
| **Backend API** | http://localhost:8000 | Django REST API |
| **Django Admin** | http://localhost:8000/admin | Painel administrativo |
| **PostgreSQL** | localhost:5432 | Banco de dados |
| **Redis** | localhost:6379 | Cache (opcional) |

### Credenciais do PostgreSQL
- **Database:** skillio_db
- **User:** postgres
- **Password:** (definido no .env)
- **Host:** localhost (fora do Docker) ou db (dentro do Docker)
- **Port:** 5432

---

## 💾 Volumes e Persistência

### Volumes Nomeados

Os dados persistem mesmo após remover containers:

```yaml
volumes:
  skillio_postgres_data      # Dados do PostgreSQL
  skillio_backend_media      # Uploads de mídia
  skillio_backend_static     # Arquivos estáticos
  skillio_backend_logs       # Logs do Django
  skillio_redis_data         # Cache Redis
  skillio_nginx_logs         # Logs do Nginx
```

### Listar volumes
```bash
docker volume ls | findstr skillio
```

### Inspecionar um volume
```bash
docker volume inspect skillio_postgres_data
```

### Backup manual do banco
```bash
docker exec skillio_db pg_dump -U postgres skillio_db > backup/manual_backup.sql
```

### Restaurar backup
```bash
docker exec -i skillio_db psql -U postgres skillio_db < backup/manual_backup.sql
```

### Remover volumes (⚠️ APAGA DADOS!)
```bash
docker-compose down -v
# ou
docker volume rm skillio_postgres_data
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Docker is not running"
**Solução:** Inicie o Docker Desktop e aguarde alguns segundos.

### ❌ Erro: "port is already allocated"
**Causa:** Porta já está em uso.
**Solução:**
```bash
# Windows - ver quem está usando a porta 8000
netstat -ano | findstr :8000

# Matar o processo (substitua PID)
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### ❌ Containers não iniciam
```bash
# Ver logs detalhados
docker-compose logs

# Reconstruir do zero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### ❌ Banco de dados não conecta
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Testar conexão
docker exec -it skillio_db psql -U postgres -d skillio_db
```

### ❌ Frontend não atualiza (HMR não funciona)
**Solução:** Use a porta direta do Vite (5173) durante desenvolvimento:
```
http://localhost:5173
```

### ❌ Erro de permissão (Linux)
```bash
# Dar permissão aos scripts
chmod +x *.sh

# Se precisar, ajustar proprietário das pastas
sudo chown -R $USER:$USER .
```

### 🧹 Limpeza completa (último recurso)
```bash
# Windows
docker-clean.bat

# Linux/Mac
docker-compose down -v
docker system prune -a --volumes
```

---

## 📊 Monitoramento

### Ver uso de recursos
```bash
docker stats
```

### Ver processos em cada container
```bash
docker-compose top
```

### Acessar shell de um container
```bash
# Backend (Django)
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh

# Banco de dados
docker-compose exec db psql -U postgres -d skillio_db
```

---

## 🚀 Deploy em Produção

### Mudanças necessárias no `.env`:
```bash
DEBUG=0
ALLOWED_HOSTS=seudominio.com,www.seudominio.com
SECRET_KEY=<gere-uma-chave-segura>
CORS_ALLOWED_ORIGINS=https://seudominio.com
```

### SSL/HTTPS com Nginx
Descomente e configure a seção HTTPS em `nginx/conf.d/skillio.conf` e adicione os certificados SSL.

### Usar PostgreSQL gerenciado
Aponte `DB_HOST` para seu banco de dados gerenciado (AWS RDS, etc.).

---

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Django Docker Best Practices](https://docs.docker.com/samples/django/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

## 🆘 Suporte

Problemas? Verifique:
1. ✅ Docker Desktop está rodando
2. ✅ Arquivo `.env` está configurado
3. ✅ Portas 80, 5173, 8000, 5432 estão livres
4. ✅ Logs dos containers: `docker-compose logs`

---

**Desenvolvido com ❤️ pela equipe Skillio**
