# Backend do Projeto Integrador

Este é o backend do projeto, desenvolvido com Django.

## Como Rodar o Projeto

Siga as instruções abaixo para configurar e rodar o ambiente de desenvolvimento local.

### Pré-requisitos

- Python 3.x instalado
- `pip` (gerenciador de pacotes do Python)

### Passos

1.  **Navegue até a pasta do backend:**

    ```bash
    cd backend
    ```

2.  **Crie um ambiente virtual:**

    ```bash
    python -m venv venv
    ```

3.  **Ative o ambiente virtual:**

    -   No Windows:
        ```bash
        venv\Scripts\activate
        ```
    -   No macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4.  **Instale as dependências:**

    Certifique-se de que o arquivo `requirements.txt` está na raiz do projeto (um nível acima da pasta `backend`).

    ```bash
    pip install -r ../requirements.txt
    ```

5.  **Aplique as migrações do banco de dados:**

    ```bash
    python manage.py migrate
    ```

6.  **Inicie o servidor de desenvolvimento:**

    ```bash
    chunk-T2SWDQEL.js?v=0784d30b:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent:1  Failed to load resource: the server responded with a status of 404 ()
127.0.0.1:8000/api/v1/users/me/:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
Lesson.tsx:69 Failed to fetch user focus AxiosError
fetchUserFocus @ Lesson.tsx:69
generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent:1  Failed to load resource: the server responded with a status of 404 ()

    ```

O servidor estará rodando em `http://127.0.0.1:8000/`.
