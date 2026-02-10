# 🧪 Guia de Testes - Sistema de Proteção de Conteúdo

## 📋 Índice
1. [Testes no Frontend (Cadastro/Editar Perfil)](#frontend)
2. [Testes no Backend (API direta)](#backend)
3. [Testes com Python Console](#python-console)
4. [Casos de Teste](#casos-de-teste)

---

## 🎨 Frontend

### 1. Teste de Cadastro (Register)

**Passos:**
1. Acesse: `http://192.168.15.7:8080/register`
2. Preencha o formulário até o passo 3 (Personalização)
3. No campo **"Qual seu foco?"**, tente inserir:

#### ✅ Casos que DEVEM SER BLOQUEADOS:

| Campo | Valor Testado | Resultado Esperado |
|-------|---------------|-------------------|
| Nome | `<script>alert('xss')</script>` | ❌ Bloqueado: "Padrão de código malicioso detectado" |
| Foco | `sexo` | ❌ Bloqueado: "Conteúdo inapropriado detectado" |
| Foco | `pornografia` | ❌ Bloqueado: "Conteúdo inapropriado detectado" |
| Foco | `matar` | ❌ Bloqueado: "Conteúdo inapropriado detectado" |
| Foco | `drogas` | ❌ Bloqueado: "Conteúdo inapropriado detectado" |
| Foco | `DROP TABLE users` | ❌ Bloqueado: "Padrão de código malicioso detectado" |
| Foco | `javascript:alert(1)` | ❌ Bloqueado: "Padrão de código malicioso detectado" |
| Profissão | `aaaaaaaaaaaaaaaaaaaa` (repetir mais de 500 caracteres) | ❌ Bloqueado: "Texto muito longo" |
| Foco | `!@#$%^&*()!@#$%^&*()!@#$%^&*()` (muitos especiais) | ❌ Bloqueado: "Muitos caracteres especiais" |

#### ✅ Casos que DEVEM PASSAR:

| Campo | Valor Testado | Resultado Esperado |
|-------|---------------|-------------------|
| Nome | `João Silva` | ✅ Aceito |
| Foco | `ENEM` | ✅ Aceito |
| Foco | `Matemática` | ✅ Aceito |
| Foco | `Programação Python` | ✅ Aceito |
| Profissão | `Estudante` | ✅ Aceito |

---

### 2. Teste de Edição de Perfil (EditProfile)

**Passos:**
1. Faça login: `http://192.168.15.7:8080/login`
2. Acesse seu perfil: `http://192.168.15.7:8080/profile`
3. Clique em "Editar Perfil"
4. Tente alterar os campos com os mesmos valores da tabela acima

**Observação:** A validação deve ocorrer:
- ✅ ANTES de enviar ao servidor (mensagem instantânea)
- ✅ AO CLICAR em "Salvar Alterações"

---

## 🔧 Backend (API direta)

### 3. Teste com cURL ou Postman

#### Teste 1: Cadastro com conteúdo bloqueado

```bash
curl -X POST http://192.168.15.7:8000/api/v1/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "password": "senha12345",
    "first_name": "sexo",
    "terms_accepted": "true",
    "focus": "Matemática"
  }'
```

**Resposta esperada:**
```json
{
  "first_name": ["O nome contém conteúdo inapropriado. Conteúdo inapropriado detectado"]
}
```

#### Teste 2: Cadastro com SQL Injection

```bash
curl -X POST http://192.168.15.7:8000/api/v1/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste2@teste.com",
    "password": "senha12345",
    "first_name": "João",
    "terms_accepted": "true",
    "focus": "DROP TABLE users"
  }'
```

**Resposta esperada:**
```json
{
  "focus": ["O foco de estudo contém conteúdo inapropriado. Padrão de código malicioso detectado"]
}
```

#### Teste 3: Editar perfil (precisa de autenticação)

```bash
# Primeiro faça login para obter o token
curl -X POST http://192.168.15.7:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seu@email.com",
    "password": "suasenha"
  }'

# Use o token retornado (access)
curl -X PATCH http://192.168.15.7:8000/api/v1/users/me/ \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "profile.focus=violência"
```

**Resposta esperada:**
```json
{
  "focus": ["O foco de estudo contém conteúdo inapropriado. Conteúdo inapropriado detectado"]
}
```

---

## 🐍 Python Console

### 4. Teste direto do ContentFilter

**Abra o console Django:**
```bash
cd backend
python manage.py shell
```

**Execute os testes:**

```python
from api.content_filter import ContentFilter

# Teste 1: Texto normal (deve passar)
print(ContentFilter.is_safe("Matemática"))
# Saída: (True, '')

# Teste 2: Conteúdo sexual (deve bloquear)
print(ContentFilter.is_safe("sexo"))
# Saída: (False, 'Conteúdo inapropriado detectado')

# Teste 3: SQL Injection (deve bloquear)
print(ContentFilter.is_safe("DROP TABLE users"))
# Saída: (False, 'Padrão de código malicioso detectado')

# Teste 4: XSS (deve bloquear)
print(ContentFilter.is_safe("<script>alert('xss')</script>"))
# Saída: (False, 'Padrão de código malicioso detectado')

# Teste 5: Texto muito longo (deve bloquear)
texto_longo = "a" * 501
print(ContentFilter.is_safe(texto_longo))
# Saída: (False, 'Texto muito longo (máximo 500 caracteres)')

# Teste 6: Sanitização
print(ContentFilter.sanitize("<b>Matemática</b>  com  espaços"))
# Saída: 'Matemática com espaços'

# Teste 7: Validador do serializer
from api.validators import validate_safe_content

try:
    validate_safe_content("pornografia", "foco")
    print("❌ NÃO DEVERIA PASSAR!")
except Exception as e:
    print(f"✅ BLOQUEADO: {e}")
# Saída: ✅ BLOQUEADO: O foco contém conteúdo inapropriado...
```

---

## 📝 Casos de Teste Completos

### Lista de Palavras Bloqueadas para Testar:

#### 🔞 Conteúdo Sexual:
- `sexo`, `porno`, `xxx`, `nudez`, `prostituição`, `erótico`, `adulto`, `fetiche`

#### ⚔️ Violência:
- `matar`, `assassinar`, `suicídio`, `violência`, `tortura`, `arma`, `bomba`, `terrorismo`

#### 😡 Ódio:
- `racismo`, `nazi`, `homofobia`, `xenofobia`, `discriminação`, `ódio`, `fascismo`

#### 🚫 Ilegal:
- `drogas`, `tráfico`, `hackear`, `pirataria`, `roubar`, `fraude`, `golpe`, `crime`

#### 💉 Injection:
- `<script>`, `javascript:`, `DROP TABLE`, `DELETE FROM`, `../`, `file://`

---

## 🎯 Teste Rápido - Checklist

### Frontend:
- [ ] Abrir formulário de cadastro
- [ ] Tentar cadastrar com foco = "sexo"
- [ ] Ver mensagem de erro vermelha
- [ ] Tentar com "Matemática"
- [ ] Deve funcionar normalmente

### Backend:
- [ ] Abrir terminal Django shell
- [ ] Testar `ContentFilter.is_safe("drogas")`
- [ ] Deve retornar `(False, 'Conteúdo inapropriado detectado')`

### API:
- [ ] Fazer requisição POST com cURL
- [ ] Incluir palavra bloqueada
- [ ] Receber erro 400 com mensagem de validação

---

## 🐛 Debug

Se algo não funcionar:

1. **No Frontend**, abra o Console do navegador (F12):
   ```javascript
   // Cole isso no console para testar manualmente
   import { ContentFilter } from './src/utils/contentFilter';
   console.log(ContentFilter.isSafe("sexo"));
   ```

2. **No Backend**, verifique os logs:
   ```bash
   # No terminal onde o Django está rodando
   # Você verá prints como:
   # ⚠️ Foco bloqueado: Conteúdo inapropriado detectado
   ```

3. **Status dos servidores:**
   ```bash
   # Backend deve estar em: http://192.168.15.7:8000
   # Frontend deve estar em: http://192.168.15.7:8080
   ```

---

## ✅ Resultado Esperado

Ao inserir conteúdo bloqueado:

**Frontend:**
![Exemplo de erro no frontend - Toast vermelho com mensagem "Conteúdo inapropriado detectado"]

**Backend (logs):**
```
⚠️ Foco bloqueado: Conteúdo inapropriado detectado
```

**API (resposta JSON):**
```json
{
  "focus": ["O foco de estudo contém conteúdo inapropriado. Conteúdo inapropriado detectado"]
}
```

---

## 🎉 Teste Passou!

Se você conseguiu:
1. ✅ Bloquear palavra sensível no cadastro
2. ✅ Ver mensagem de erro clara
3. ✅ Cadastrar com sucesso usando termo válido
4. ✅ Backend retornar erro 400 na API

**Parabéns! O sistema de proteção está funcionando! 🛡️**
