# Projeto Integrador

Este projeto é composto por três partes principais: **Backend**, **Frontend** e **Moblie**.

## Como executar o projeto

### Opção 1: Usando Docker (Recomendado)

Para executar o projeto completo usando Docker, siga os passos abaixo:

#### Pré-requisitos
- Docker instalado no sistema
- Docker Compose instalado

#### Passos para execução
1. **Clone o repositório e navegue até a raiz do projeto:**
   ```bash
   git clone <url-do-repositorio>
   cd projeto_integrador
   ```

2. **Execute o projeto com Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse as aplicações:**
   - Frontend: http://localhost:3000 ou http://SEU_IP:3000
   - Backend API: http://localhost:8000 ou http://SEU_IP:8000
   - Admin Django: http://localhost:8000/admin ou http://SEU_IP:8000/admin

#### Acesso em Outro PC/Rede

Para acessar de outro dispositivo na mesma rede:

1. **Descubra o IP do seu computador:**
   - Windows: Abra o CMD e execute `ipconfig` (procure por "Endereço IPv4")
   - Linux/Mac: Execute `ifconfig` ou `ip addr` no terminal

2. **Substitua `localhost` pelo seu IP nas URLs:**
   - Frontend: `http://SEU_IP:3000`
   - Backend: `http://SEU_IP:8000`

3. **Configure o firewall:**
   - Permita conexões nas portas 3000 e 8000 no firewall do Windows/Linux

4. **Para produção:** Considere usar um proxy reverso (nginx) e HTTPS.

#### Comandos úteis do Docker
- **Parar os containers:**
  ```bash
  docker-compose down
  ```

- **Ver logs:**
  ```bash
  docker-compose logs -f
  ```

- **Reconstruir e executar:**
  ```bash
  docker-compose up --build --force-recreate
  ```

- **Executar em background:**
  ```bash
  docker-compose up -d
  ```

### Opção 2: Execução Local (Desenvolvimento)

#### Requisitos
- Node.js (recomendado v18 ou superior)
- npm ou bun (para o Frontend)
- Python 3.x (para o Backend)
- PostgreSQL (banco de dados)

#### Instalação das Bibliotecas

##### Frontend
1. Navegue até a pasta do frontend:
   ```cmd
   cd Frontend
   ```
2. Instale as dependências usando npm (recomendado):
   ```cmd
   npm install
   ```
   Ou, se preferir usar bun:
   ```cmd
   bun install
   ```

##### Backend
1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Crie um ambiente virtual:
   ```bash
   python -m venv venv
   ```
3. Ative o ambiente virtual:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Instale as dependências:
   ```bash
   pip install -r ../requirements.txt
   ```

#### Como executar localmente

##### Backend
1. Na pasta `backend`, aplique as migrações:
   ```bash
   python manage.py migrate
   ```
2. Inicie o servidor:
   ```bash
   python manage.py runserver
   ```

##### Frontend
1. Na pasta `Frontend`, execute:
   ```cmd
   npm run dev
   ```
   Ou, se estiver usando bun:
   ```cmd
   bun run dev
   ```
2. O projeto estará disponível em `http://localhost:5173`.

## Observações
- Certifique-se de que as portas utilizadas pelo backend e frontend não estejam em conflito.
- Para dúvidas ou problemas, consulte os arquivos `README.md` específicos de cada pasta ou entre em contato com o responsável pelo projeto.
