# 📊 Sistema de Pontuação e Níveis - Skillio

## ✅ Sistema Correto (Após Correção)

### 🎯 XP (Experiência)
- **Função**: Sistema de pontos cumulativo que **NUNCA** diminui
- **Fontes de XP**:
  - ✅ Resposta correta: **+10 XP**
  - ✅ Missão diária completa: **+5 a +20 XP** (depende da missão)
  - ✅ Missão semanal completa: **+50 a +100 XP**
  - ✅ Missão mensal completa: **+200 a +500 XP**
- **Comportamento**: XP apenas acumula, serve como métrica de progresso total
- **NÃO afeta nível**: XP é independente do sistema de níveis

### 📈 Nível (Level)
- **Função**: Representa a progressão na trilha de aprendizado
- **Cálculo**: `nível = (blocos_completos ÷ 15) + 1`
- **Exemplos**:
  - 0 blocos = Nível 1
  - 15 blocos = Nível 2
  - 30 blocos = Nível 3
  - 45 blocos = Nível 4
- **Comportamento**: Sobe automaticamente ao completar blocos
- **Endpoint responsável**: `POST /api/v1/study/gamification/complete-block/`

### ❤️ Vidas (Hearts)
- **Máximo**: 5 vidas
- **Perda**: -1 vida por resposta errada
- **Recarga**: +1 vida a cada 3 minutos (quando < 5 vidas)
- **Bloqueio**: Sem vidas = não pode iniciar novos blocos

---

## ❌ Sistema Anterior (INCORRETO - Corrigido)

### Problema 1: Dois sistemas conflitantes
```python
# ❌ REMOVIDO - CompleteQuestView calculava level por XP
xp_for_next_level = 100 * (level ** 1.5)
if xp >= xp_for_next_level:
    level += 1
    xp -= xp_for_next_level  # ❌ Subtraía XP!
```

### Problema 2: XP era subtraído ao subir de nível
- ❌ Quando o usuário subia de nível, o XP era reduzido
- ❌ Isso confundia os usuários (progresso "sumindo")
- ✅ **Corrigido**: XP agora só acumula

### Problema 3: Level subia por XP em vez de blocos
- ❌ Missões davam XP que subia o nível
- ❌ Inconsistente com a trilha de aprendizado
- ✅ **Corrigido**: Level agora é baseado apenas em blocos completados

---

## 🔧 Arquivos Alterados

### Backend
**Arquivo**: `backend/api/views.py`

**View**: `CompleteQuestView` (linhas ~515-525)
```python
# ✅ ANTES (INCORRETO):
gamification.xp += quest.xp_reward
xp_for_next_level = 100 * (gamification.level ** 1.5)
if gamification.xp >= xp_for_next_level:
    gamification.level += 1
    gamification.xp = int(gamification.xp - xp_for_next_level)  # ❌ Subtraía XP

# ✅ DEPOIS (CORRETO):
gamification.xp += quest.xp_reward  # Apenas acumula XP
# Level é calculado APENAS por blocos (em CompleteBlockView)
```

**View**: `AddXpView` (linha 405)
```python
# ✅ Comentário atualizado:
return Response({
    'level_up': False,  # Level sobe apenas quando completa 15 blocos, não por XP
    'new_level': gamification.level,
    'new_xp': gamification.xp
})
```

**View**: `CompleteBlockView` (linhas 563-571)
```python
# ✅ Sistema CORRETO (mantido):
new_level = (len(blocos_completos) // 15) + 1
gamification.level = new_level
gamification.save()
```

### Frontend
Nenhuma alteração necessária - o frontend já estava correto.

---

## 📋 Como Testar

### 1. Verificar XP acumula corretamente
```bash
# Backend
python manage.py shell
```
```python
from django.contrib.auth.models import User
user = User.objects.get(username='seu_email@exemplo.com')
print(f"XP atual: {user.gamification.xp}")
print(f"Nível atual: {user.gamification.level}")
print(f"Blocos completados: {len(user.profile.blocos_completos or [])}")
```

### 2. Completar bloco e verificar nível
```bash
# POST /api/v1/study/gamification/complete-block/
# Body: { "block_id": "matematica-nivel1-bloco1" }
```

**Verificar**:
- ✅ XP **não** mudou
- ✅ Nível subiu quando atingiu múltiplo de 15 blocos
- ✅ `blocos_completos` aumentou em 1

### 3. Completar missão e verificar XP
```bash
# POST /api/v1/study/gamification/complete-quest/
# Body: { "quest_id": "login_streak" }
```

**Verificar**:
- ✅ XP aumentou conforme `quest.xp_reward`
- ✅ Nível **não** mudou (apenas blocos afetam nível)

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────────────────────┐
│                    COMPLETAR BLOCO                       │
│  ┌──────────────┐                                        │
│  │   Bloco 15   │  →  blocos_completos = 15             │
│  └──────────────┘      ↓                                 │
│                      Nível = (15 ÷ 15) + 1 = 2           │
│                      XP = não muda                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  RESPONDER PERGUNTA                      │
│  ┌──────────────┐                                        │
│  │  Acertou ✓   │  →  XP += 10                          │
│  └──────────────┘      Nível = não muda                  │
│                      Hearts = não muda                   │
│  ┌──────────────┐                                        │
│  │  Errou ✗     │  →  XP = não muda                     │
│  └──────────────┘      Nível = não muda                  │
│                      Hearts -= 1                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   COMPLETAR MISSÃO                       │
│  ┌──────────────┐                                        │
│  │ Missão Diária│  →  XP += 10 (exemplo)                │
│  └──────────────┘      Nível = não muda                  │
│                      Hearts = não muda                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎮 Gamificação Completa

### Sistemas Independentes

1. **XP (Experiência)**: Pontos acumulativos de progressão geral
2. **Nível**: Baseado em blocos completados (15 blocos = 1 nível)
3. **Vidas**: Sistema de limite de erros
4. **Streak**: Dias consecutivos de atividade
5. **Missões**: Objetivos diários/semanais/mensais
6. **Conquistas**: Marcos especiais desbloqueados

### Relação Entre Sistemas

```
Responder Perguntas
    ├── ✓ Acerto → +10 XP
    └── ✗ Erro → -1 Vida

Completar Bloco (todas perguntas)
    ├── +1 bloco em blocos_completos
    └── Se blocos % 15 == 0 → +1 Nível

Completar Missão
    └── +XP (valor da missão)

Login Diário
    └── +1 Streak (se consecutivo)
```

---

## 🚀 Melhorias Futuras (Opcional)

### Ideias para expandir o sistema:

1. **Sistema de Ranking por XP**
   - Manter XP acumulativo
   - Usar para classificação global

2. **Recompensas por XP**
   - Marcos de XP desbloqueiam avatares/badges
   - Ex: 1000 XP = avatar especial

3. **Prestige System**
   - Quando completa todos os blocos disponíveis
   - "Reset" opcional com bônus permanentes

4. **Conquistas por XP**
   - "Mestre de 10.000 XP"
   - "100.000 pontos de experiência"

---

## 📝 Observações Importantes

1. **Nunca subtrair XP**: XP é métrica histórica de progresso
2. **Nível baseado em blocos**: Garante progressão linear e previsível
3. **Missões auto-completadas**: Sistema marca automaticamente ao detectar ações do usuário
4. **Vidas recargam automaticamente**: 1 vida a cada 3 minutos

---

**Data da correção**: 5 de março de 2026  
**Versão**: 1.0  
**Status**: ✅ Sistema corrigido e funcionando
