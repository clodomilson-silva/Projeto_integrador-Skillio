# 🏆 Sistema de Conquistas - Guia de Verificação

## 🔍 Como o Sistema Funciona

### Fluxo Correto de Desbloqueio

#### 1. Jogador VENCE um Bloco (15 perguntas corretas + vidas restantes)

```
Frontend (Game.tsx):
  ↓
  handleGameOver detecta: !lossReason && hearts > 0
  ↓
  addXp(150) → Backend AddXpView
  ↓
  completeBlock(blocoId) → Backend CompleteBlockView
  ↓
  Backend: Verifica e desbloqueia conquistas
```

**Backend Log Esperado:**
```
✅ AddXpView: User test@example.com - After save - Level: 1, XP: 150
   Gamification ID: 1
🔍 check_and_unlock_achievements: User test@example.com
   Stats: Level=1, XP=150, Streak=0, Blocos=0  # ← Blocos ainda é 0!
   Blocos completos: []
   Conquistas já desbloqueadas: []
   Nenhuma conquista nova desbloqueada nesta verificação  # ← Correto, ainda não completou bloco

✅ CompleteBlockView: User test@example.com completed block nivel1-bloco1
   Total blocks: 1, Level: 1 -> 1
   Complete blocks list: ['nivel1-bloco1']
🔍 check_and_unlock_achievements: User test@example.com
   Stats: Level=1, XP=150, Streak=0, Blocos=1  # ← Agora Blocos=1!
   Blocos completos: ['nivel1-bloco1']
   Conquistas já desbloqueadas: []
🏆 Conquista desbloqueada: Primeiro Passo (bloco_1) para test@example.com  # ← Desbloqueado!
✅ Total de 1 conquistas desbloqueadas nesta verificação
🏆 CompleteBlockView: Novas conquistas desbloqueadas: ['bloco_1']
```

#### 2. Jogador PERDE um Bloco (5 erros OU sem vidas)

```
Frontend (Game.tsx):
  ↓
  handleGameOver detecta: lossReason = 'mistakes' or 'hearts'
  ↓
  RETURN (não chama addXp nem completeBlock)
  ↓
  XP descartado, bloco não completado
```

**Backend Log Esperado:**
```
(Nenhum log de AddXpView ou CompleteBlockView)
```

### Critérios das Conquistas

| ID | Nome | Descrição | Critério |
|----|------|-----------|----------|
| `bloco_1` | Primeiro Passo | Complete seu primeiro bloco | `blocos >= 1` |
| `blocos_10` | Pegando o Ritmo | Complete 10 blocos | `blocos >= 10` |
| `blocos_50` | Maratonista do Saber | Complete 50 blocos | `blocos >= 50` |
| `blocos_100` | Centurião do Conhecimento | Complete 100 blocos | `blocos >= 100` |
| `nivel_5` | Aprendiz Dedicado | Alcance o Nível 5 | `level >= 5` |
| `nivel_10` | Estudante Experiente | Alcance o Nível 10 | `level >= 10` |
| `nivel_20` | Mestre do Nivelamento | Alcance o Nível 20 | `level >= 20` |
| `streak_3` | Consistência é a Chave | Sequência de 3 dias | `streak >= 3` |
| `streak_7` | Hábito Formado | Sequência de 7 dias | `streak >= 7` |
| `streak_30` | Lenda Viva | Sequência de 30 dias | `streak >= 30` |
| `xp_1000` | Acumulador de XP | Acumule 1000 XP | `xp >= 1000` |
| `xp_5000` | Força do Conhecimento | Acumule 5000 XP | `xp >= 5000` |

## 🛠️ Correções Implementadas

### 1. Cache Stale (Dados Desatualizados)

**Problema:** `check_and_unlock_achievements` usava dados em cache do Django ORM

**Solução:** Adicionado `refresh_from_db()`:
```python
def check_and_unlock_achievements(user: User) -> list:
    # Recarrega dados do banco para evitar cache stale
    user.refresh_from_db()
    gamification.refresh_from_db()
    profile.refresh_from_db()
    # ...
```

### 2. Logs Detalhados

**Adicionado:** Logs completos para debug
```python
print(f"🔍 check_and_unlock_achievements: User {user.username}")
print(f"   Stats: Level={level}, XP={xp}, Streak={streak}, Blocos={blocos}")
print(f"   Blocos completos: {lista_blocos}")
print(f"   Conquistas já desbloqueadas: {ids}")
```

### 3. Ordem de Verificação

**Confirmado:** Sistema verifica conquistas DEPOIS de completar bloco:
1. `addXp()` → verifica conquistas (blocos ainda não atualizados)
2. `completeBlock()` → adiciona bloco → verifica conquistas (blocos atualizados) ✅

## 🧪 Como Testar

### Teste 1: Primeira Conquista

1. **Criar usuário novo** (ou resetar)
2. **Jogar 1 bloco e VENCER** (15 perguntas corretas)
3. **Verificar backend logs:**
   ```
   🏆 Conquista desbloqueada: Primeiro Passo (bloco_1)
   ```
4. **Verificar frontend (Profile):** Conquista "Primeiro Passo" deve estar VERDE/EMERALD

### Teste 2: Bloco Perdido

1. **Jogar 1 bloco e PERDER** (5 erros ou sem vidas)
2. **Verificar backend logs:** Nenhum log de CompleteBlockView
3. **Verificar frontend (Profile):** Nenhuma conquista nova

### Teste 3: Múltiplos Blocos

1. **Completar 10 blocos com sucesso**
2. **Verificar conquistas desbloqueadas:**
   - ✅ Primeiro Passo (1 bloco)
   - ✅ Pegando o Ritmo (10 blocos)

### Teste 4: Conquistas de XP

1. **Acumular 1000 XP** (completando blocos)
2. **Verificar backend log:**
   ```
   🏆 Conquista desbloqueada: Acumulador de XP (xp_1000)
   ```

## 🔧 Comandos Úteis

### Verificar Conquistas no Backend

```bash
cd backend
python manage.py shell
```

```python
from django.contrib.auth.models import User
from api.models import Achievement, UserAchievement

# Ver todas as conquistas disponíveis
Achievement.objects.all()

# Ver conquistas de um usuário
user = User.objects.get(username='test@example.com')
UserAchievement.objects.filter(user=user)

# Ver estatísticas do usuário
user.gamification.level
user.gamification.xp
user.gamification.streak
user.profile.blocos_completos
```

### Resetar Conquistas (TESTE APENAS)

```python
# ⚠️ CUIDADO: Remove todas as conquistas do usuário
UserAchievement.objects.filter(user=user).delete()
```

### Verificar Logs em Tempo Real

```bash
cd backend

# Windows (PowerShell)
Get-Content logs\backend.log -Wait -Tail 50

# Linux/Mac
tail -f logs/backend.log
```

## ❓ Troubleshooting

### Conquista não desbloqueia mesmo completando bloco

**Verificar:**
1. Backend logs mostram `CompleteBlockView`?
2. `blocos_completos` foi atualizado?
3. Comando `init_achievements` foi executado?
4. Achievement existe no banco?

```python
# Verificar se achievement existe
Achievement.objects.filter(id='bloco_1').exists()  # Deve ser True
```

### Conquista desbloqueia quando não deveria

**Verificar:**
1. Frontend chama `completeBlock` mesmo quando perde?
2. Logs mostram lossReason correto?
3. Verificar condição: `!lossReason && hearts > 0`

### Conquista aparece cinza mesmo desbloqueada

**Verificar:**
1. `/users/me/` retorna achievement na lista?
2. `useGamification` está carregando corretamente?
3. Cache do localStorage está limpo?

```javascript
// Limpar cache (DevTools Console)
localStorage.clear();
location.reload();
```

## 📊 Estrutura de Dados

### UserAchievement (Backend)
```python
{
    "user": User,
    "achievement": Achievement,
    "unlocked_at": DateTime
}
```

### Frontend Response
```json
{
  "profile": {
    "achievements": [
      {
        "achievement": {
          "id": "bloco_1",
          "name": "Primeiro Passo",
          "description": "Complete seu primeiro bloco de perguntas.",
          "icon": "Footprints"
        },
        "unlocked_at": "2026-03-05T10:30:00Z"
      }
    ],
    "blocos_completos": ["nivel1-bloco1"],
    "gamification": {
      "level": 1,
      "xp": 150,
      "streak": 0,
      "hearts": 5
    }
  }
}
```

## ✅ Checklist de Validação

Antes de reportar bug, verificar:

- [ ] Comando `init_achievements` foi executado
- [ ] Backend logs mostram verificação de conquistas
- [ ] Frontend chama `completeBlock` apenas quando vence
- [ ] `/users/me/` retorna conquistas corretas
- [ ] Profile.tsx mostra conquistas em verde quando desbloqueadas
- [ ] Cache do navegador foi limpo (localStorage)

---

**Status:** ✅ Sistema corrigido com refresh_from_db() e logs detalhados  
**Data:** 5 de março de 2026
