# 🏆 Sistema de Conquistas (Achievements) - Skillio

## ✅ Como Funciona

O sistema de conquistas foi implementado para **desbloquear automaticamente** badges conforme o usuário progride no aplicativo.

### 📋 Conquistas Disponíveis

#### 🎯 Blocos Completos
- **Primeiro Passo**: 1 bloco completo
- **Pegando o Ritmo**: 10 blocos completos
- **Maratonista do Saber**: 50 blocos completos
- **Centurião do Conhecimento**: 100 blocos completos

#### ⭐ Níveis
- **Aprendiz Dedicado**: Nível 5
- **Estudante Experiente**: Nível 10
- **Mestre do Nivelamento**: Nível 20

#### 🔥 Sequência (Streak)
- **Consistência é a Chave**: 3 dias consecutivos
- **Hábito Formado**: 7 dias consecutivos
- **Lenda Viva**: 30 dias consecutivos

#### ⚡ XP Acumulado
- **Acumulador de XP**: 1000 XP total
- **Força do Conhecimento**: 5000 XP total

---

## 🔧 Configuração Inicial

### 1️⃣ Inicializar Conquistas no Banco de Dados

Execute o comando para criar todas as conquistas:

```bash
cd backend
python manage.py init_achievements
```

**Saída esperada:**
```
Inicializando conquistas...
✅ 12 conquistas inicializadas/atualizadas
✅ Conquistas inicializadas com sucesso!
```

### 2️⃣ Verificar Conquistas Criadas

```bash
python manage.py shell
```

```python
from api.models import Achievement

# Listar todas as conquistas
for ach in Achievement.objects.all():
    print(f"✅ {ach.id}: {ach.name}")
```

---

## 🚀 Desbloqueio Automático

As conquistas são verificadas e desbloqueadas **automaticamente** quando o usuário:

### ✅ Completa um Bloco
**Endpoint**: `POST /api/v1/study/gamification/complete-block/`

```python
# Em CompleteBlockView (backend/api/views.py)
from .achievements_manager import check_and_unlock_achievements
newly_unlocked = check_and_unlock_achievements(user)
```

**Verifica conquistas de**:
- Blocos completos (1, 10, 50, 100)
- Níveis (calculados a partir de blocos: 15 blocos = 1 nível)

### ✅ Ganha XP
**Endpoint**: `POST /api/v1/study/gamification/add-xp/`

```python
# Em AddXpView (backend/api/views.py)
from .achievements_manager import check_and_unlock_achievements
newly_unlocked = check_and_unlock_achievements(user)
```

**Verifica conquistas de**:
- XP acumulado (1000, 5000)
- Streak (quando implementado)

---

## 🎨 Interface (Frontend)

### Profile.tsx

As conquistas são exibidas no perfil do usuário com cores diferentes:

#### 🟢 Conquista Desbloqueada (Verde)
```tsx
className="border-emerald-500/70 bg-gradient-to-br from-emerald-50 to-emerald-100/50 
           dark:from-emerald-950/50 dark:to-emerald-900/30 
           shadow-lg shadow-emerald-500/20"
```

**Visual**:
- ✅ Borda verde
- ✅ Fundo verde claro/escuro (com suporte dark mode)
- ✅ Badge "Conquistado" em verde
- ✅ Ícone e texto em verde

#### ⚪ Conquista Bloqueada (Cinza)
```tsx
className="opacity-50 hover:opacity-75 grayscale"
```

**Visual**:
- ❌ Opacidade reduzida
- ❌ Efeito grayscale (preto e branco)
- ❌ Sem badge

---

## 📊 Exemplo de Fluxo

### Usuário completa 1 bloco

1. **Frontend** → `POST /api/v1/study/gamification/complete-block/`
   ```json
   { "block_id": "matematica-nivel1-bloco1" }
   ```

2. **Backend** processa:
   ```python
   # 1. Adiciona bloco à lista
   profile.blocos_completos.append(block_id)
   
   # 2. Recalcula nível
   gamification.level = (len(blocos) // 15) + 1
   
   # 3. Verifica conquistas
   check_and_unlock_achievements(user)
   ```

3. **Sistema verifica**:
   ```python
   stats = {
       'blocos': 1,
       'level': 1,
       'xp': 10,
       'streak': 0
   }
   
   # Conquista "bloco_1" deve desbloquear?
   if stats['blocos'] >= 1:  # ✅ SIM!
       UserAchievement.objects.create(
           user=user,
           achievement=Achievement.objects.get(pk='bloco_1')
       )
       print("🏆 Conquista desbloqueada: Primeiro Passo")
   ```

4. **Frontend** atualiza:
   ```tsx
   // useGamification recarrega dados
   const newAchievements = data.profile.achievements.map(ua => ua.achievement.id)
   setUnlockedAchievements(newAchievements)  // ['bloco_1']
   ```

5. **Profile.tsx mostra em verde**:
   ```tsx
   const isEarned = unlockedAchievements.includes('bloco_1')  // true
   // Card renderiza com estilo verde ✅
   ```

---

## 🔍 Verificar Conquistas de um Usuário

### Via Django Shell
```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from api.models import UserAchievement

# Buscar usuário
user = User.objects.get(username='exemplo@email.com')

# Listar conquistas desbloqueadas
for ua in user.achievements.all():
    print(f"🏆 {ua.achievement.name} - Desbloqueado em {ua.unlocked_at}")

# Forçar verificação manual
from api.achievements_manager import check_and_unlock_achievements
newly_unlocked = check_and_unlock_achievements(user)
print(f"Novas conquistas: {newly_unlocked}")
```

### Via API (Frontend)
```typescript
// useGamification já carrega automaticamente
const { unlockedAchievements } = useGamification();
console.log("Conquistas:", unlockedAchievements);
// ['bloco_1', 'xp_1000', 'nivel_5']
```

---

## 🛠️ Adicionar Nova Conquista

### 1. Backend: `backend/api/achievements_manager.py`

```python
ACHIEVEMENTS_DEFINITIONS = [
    # ... conquistas existentes ...
    
    # Nova conquista
    {
        'id': 'perfeccionista',
        'name': 'Perfeccionista',
        'description': 'Complete 10 blocos com 100% de acertos',
        'icon': 'Target',
        'check': lambda stats: stats.get('blocos_perfeitos', 0) >= 10,
    },
]
```

### 2. Frontend: `Frontend/src/data/achievements.ts`

```typescript
export const allAchievements: Achievement[] = [
  // ... conquistas existentes ...
  
  // Nova conquista
  {
    id: 'perfeccionista',
    name: 'Perfeccionista',
    description: 'Complete 10 blocos com 100% de acertos',
    icon: 'Target',
    criteria: (stats) => stats.blocosPerfeitos >= 10,
  },
];
```

### 3. Atualizar banco de dados

```bash
python manage.py init_achievements
```

---

## 🐛 Troubleshooting

### Conquista não desbloqueia

1. **Verificar se está no banco**:
   ```python
   from api.models import Achievement
   Achievement.objects.filter(id='bloco_1').exists()  # Deve ser True
   ```

2. **Verificar estatísticas do usuário**:
   ```python
   user = User.objects.get(username='exemplo@email.com')
   print(f"Blocos: {len(user.profile.blocos_completos or [])}")
   print(f"XP: {user.gamification.xp}")
   print(f"Nível: {user.gamification.level}")
   ```

3. **Forçar verificação**:
   ```python
   from api.achievements_manager import check_and_unlock_achievements
   newly_unlocked = check_and_unlock_achievements(user)
   print(f"Desbloqueadas: {newly_unlocked}")
   ```

### Conquistas não aparecem no frontend

1. **Limpar cache**:
   ```typescript
   localStorage.removeItem('gamification_achievements');
   ```

2. **Recarregar dados**:
   ```typescript
   const { refetchData } = useGamification();
   refetchData();
   ```

---

## 📝 Logs de Debug

O sistema registra logs quando conquistas são desbloqueadas:

```
CompleteBlockView: User exemplo@email.com completed block matematica-nivel1-bloco1
CompleteBlockView: Total blocks: 1, Level: 1 -> 1
🏆 Conquista desbloqueada: Primeiro Passo para exemplo@email.com
🏆 Novas conquistas desbloqueadas: ['bloco_1']
```

---

## ✅ Resumo

| Ação | Sistema Verifica Conquistas |
|------|----------------------------|
| Completar bloco | ✅ Sim (CompleteBlockView) |
| Ganhar XP | ✅ Sim (AddXpView) |
| Completar missão | ❌ Não (missões dão XP, que verifica) |
| Login diário | ❌ Não (atualiza streak manualmente) |

**Conquistas são verificadas automaticamente** quando:
- Usuário completa um bloco
- Usuário ganha XP

O sistema é **totalmente automático** - nenhuma ação manual é necessária!

---

**Data de criação**: 5 de março de 2026  
**Versão**: 1.0  
**Status**: ✅ Implementado e funcionando
