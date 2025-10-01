# API Skill.io - Documentação

## Visão Geral

Esta API REST foi desenvolvida em Django e Django REST Framework para a plataforma de aprendizado Skill.io. O sistema é focado em gamificação, permitindo que usuários se cadastrem, realizem quizzes, ganhem pontos (XP), subam de nível e desbloqueiem conquistas.

## Funcionalidades Principais

### Autenticação de Usuários
- Registro de usuários com campos customizados (foco de estudo, etc.).
- Login/logout seguro utilizando JWT (JSON Web Tokens).
- Gestão de perfil de usuário, incluindo upload de foto.

### Gamificação
- **Níveis e XP**: Usuários ganham pontos de experiência (XP) ao completar atividades.
- **Conquistas**: Catálogo de conquistas que podem ser desbloqueadas.
- **Missões Diárias**: Tarefas diárias que recompensam os usuários com XP.
- **Ranking**: Sistema de streaks e pontuação para engajamento.

### Quizzes
- Endpoint para recebimento dos resultados de quizzes de nivelamento.
- Armazenamento do desempenho do usuário por matéria e área de conhecimento.

## Endpoints da API

### Autenticação (`/api/v1/auth/`)

- **`POST /register/`**: Registro de novo usuário.
- **`POST /login/`**: Login de usuário para obter tokens JWT.
- **`GET/PUT /profile/`**: Visualizar e atualizar o perfil do usuário logado.
- **`POST /logout/`**: Efetua o logout do usuário (adiciona o refresh token à blacklist).
- **`POST /change-password/`**: Permite que o usuário altere sua senha.
- **`GET /dashboard/`**: Retorna dados consolidados para o dashboard do usuário.

### Gamificação e Quizzes (`/api/v1/study/`)

- **`GET /achievements/`**: Lista todas as conquistas disponíveis na plataforma.
- **`GET /my-achievements/`**: Lista as conquistas desbloqueadas pelo usuário logado.
- **`GET /daily-quests/`**: Lista todas as missões diárias disponíveis.
- **`GET /my-daily-quests/`**: Lista o status das missões diárias para o usuário logado.
- **`POST /quiz-results/`**: Armazena o resultado de um quiz de nivelamento para o usuário.

### Tokens JWT (`/api/v1/auth/token/`)

- **`POST /token/`**: Rota padrão do Simple JWT para obter um par de tokens (access e refresh).
- **`POST /token/refresh/`**: Renova um token de acesso expirado usando um refresh token válido.
- **`POST /token/verify/`**: Verifica a validade de um token.

## Modelos de Dados Principais

### App `accounts`
- **`User`**: Modelo de usuário customizado, com login por e-mail.
- **`UserGamification`**: Armazena dados de gamificação do usuário (nível, XP, streak).
- **`UserAchievement`**: Registra as conquistas desbloqueadas por um usuário.
- **`UserDailyQuest`**: Armazena o status (concluída ou não) de uma missão diária para um usuário em uma data específica.

### App `study_plans`
- **`Achievement`**: Catálogo de todas as conquistas disponíveis.
- **`DailyQuest`**: Catálogo de todas as missões diárias.
- **`QuizResult`**: Armazena o resultado de um quiz (respostas certas/erradas) para um usuário em uma matéria/área.

## Como Executar

1.  **Navegue até a pasta `backend`**:
    ```bash
    cd backend
    ```

2.  **Ative o ambiente virtual**:
    - No PowerShell:
      ```bash
      .\venv\Scripts\Activate.ps1
      ```
    - No CMD:
      ```bash
      .\venv\Scripts\activate.bat
      ```

3.  **Instale as dependências**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Execute as migrações do banco de dados**:
    ```bash
    python manage.py migrate
    ```

5.  **Crie um superusuário (opcional)**:
    Isso permitirá o acesso ao painel de administração do Django.
    ```bash
    python manage.py createsuperuser
    ```

6.  **Execute o servidor de desenvolvimento**:
    ```bash
    python manage.py runserver
    ```

A API estará disponível em `http://127.0.0.1:8000/`.

## Admin Interface

Acesse `/admin/` para gerenciar os modelos do banco de dados diretamente pela interface de administração do Django.
