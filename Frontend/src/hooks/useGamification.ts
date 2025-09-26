import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allAchievements, Achievement } from '@/data/achievements';

const MAX_HEARTS = 5;
const HEART_REFILL_RATE = 1000 * 60 * 60; // 1 hour in ms

const calculateXpForLevel = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

interface UserStats {
  xp: number;
  level: number;
  blocosCompletos: string[];
  streak: number;
  lastLoginDate: string; // ISO string
  hearts: number;
  lastHeartTimestamp: number; // Unix timestamp
}

export interface Quest {
    id: string;
    description: string;
    isCompleted: boolean;
}

const getDailyQuests = (): Quest[] => [
    { id: 'quest1', description: 'Complete 3 blocos de perguntas', isCompleted: false },
    { id: 'quest2', description: 'Acerte 20 perguntas', isCompleted: false },
    { id: 'quest3', description: 'Mantenha sua sequência de login', isCompleted: false },
];

export const useGamification = () => {
  const { toast } = useToast();

  const [stats, setStats] = useState<UserStats>(() => {
    const savedXp = parseInt(localStorage.getItem('userXp') || '0', 10);
    const savedLevel = parseInt(localStorage.getItem('userLevel') || '1', 10);
    const savedBlocosRaw = localStorage.getItem('blocosCompletos');
    const savedBlocos = savedBlocosRaw && savedBlocosRaw !== 'undefined' ? JSON.parse(savedBlocosRaw) : [];
    const savedStreak = parseInt(localStorage.getItem('userStreak') || '0', 10);
    const savedLastLogin = localStorage.getItem('lastLoginDate') || new Date(0).toISOString();
    const savedHearts = parseInt(localStorage.getItem('userHearts') || `${MAX_HEARTS}`, 10);
    const savedHeartTimestamp = parseInt(localStorage.getItem('lastHeartTimestamp') || `${Date.now()}`, 10);

    return { 
        xp: savedXp, 
        level: savedLevel, 
        blocosCompletos: savedBlocos, 
        streak: savedStreak, 
        lastLoginDate: savedLastLogin,
        hearts: savedHearts,
        lastHeartTimestamp: savedHeartTimestamp,
    };
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    try {
        return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [dailyQuests, setDailyQuests] = useState<Quest[]>(() => {
      const saved = localStorage.getItem('dailyQuests');
      const lastQuestDate = localStorage.getItem('questsDate');
      const todayStr = new Date().toDateString();
      if (lastQuestDate !== todayStr) {
          localStorage.setItem('questsDate', todayStr);
          return getDailyQuests();
      }
      try {
        return saved && saved !== 'undefined' ? JSON.parse(saved) : getDailyQuests();
      } catch (e) { return getDailyQuests(); }
  });

  const xpForNextLevel = calculateXpForLevel(stats.level);
  const progressPercentage = Math.max(0, Math.min(100, (stats.xp / xpForNextLevel) * 100));

  // Heart refill logic
  useEffect(() => {
    if (stats.hearts < MAX_HEARTS) {
      const now = Date.now();
      const diff = now - stats.lastHeartTimestamp;
      const heartsToRefill = Math.floor(diff / HEART_REFILL_RATE);

      if (heartsToRefill > 0) {
        const newHearts = Math.min(stats.hearts + heartsToRefill, MAX_HEARTS);
        const newTimestamp = stats.lastHeartTimestamp + (heartsToRefill * HEART_REFILL_RATE);
        setStats(prev => ({ ...prev, hearts: newHearts, lastHeartTimestamp: newTimestamp }));
      }
    }
    // Set up an interval to check for refills periodically
    const interval = setInterval(() => {
        setStats(prev => {
            if (prev.hearts < MAX_HEARTS) {
                const now = Date.now();
                const diff = now - prev.lastHeartTimestamp;
                const heartsToRefill = Math.floor(diff / HEART_REFILL_RATE);
                if (heartsToRefill > 0) {
                    const newHearts = Math.min(prev.hearts + heartsToRefill, MAX_HEARTS);
                    const newTimestamp = prev.lastHeartTimestamp + (heartsToRefill * HEART_REFILL_RATE);
                    return { ...prev, hearts: newHearts, lastHeartTimestamp: newTimestamp };
                }
            }
            return prev;
        });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [stats.hearts, stats.lastHeartTimestamp]);

  const checkAchievements = useCallback((currentStats: UserStats, currentUnlocked: string[]) => {
    const newlyUnlocked: Achievement[] = [];
    allAchievements.forEach((achievement) => {
      if (!currentUnlocked.includes(achievement.id) && achievement.criteria(currentStats)) {
        newlyUnlocked.push(achievement);
      }
    });
    if (newlyUnlocked.length > 0) {
      const newUnlockedIds = [...currentUnlocked, ...newlyUnlocked.map(a => a.id)];
      setUnlockedAchievements(newUnlockedIds);
      newlyUnlocked.forEach(achievement => {
        toast({ title: "🎉 Conquista Desbloqueada!", description: `Você ganhou: "${achievement.name}"`, className: 'bg-gradient-warning text-white border-none' });
      });
    }
  }, [toast]);

  // Streak logic
  useEffect(() => {
    const today = new Date();
    const lastLogin = new Date(stats.lastLoginDate);
    if (today.toDateString() === lastLogin.toDateString()) return;
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    let newStreak = diffDays === 1 ? stats.streak + 1 : 1;
    if (diffDays > 1) toast({ title: "🔥 Sequência Perdida!", description: `Você precisa praticar todos os dias!`, variant: 'destructive' });
    else toast({ title: "🔥 Sequência Mantida!", description: `Você está há ${newStreak} dias seguidos!`, className: 'bg-orange-500 text-white border-none' });
    setStats(prev => ({ ...prev, streak: newStreak, lastLoginDate: today.toISOString() }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('userLevel', stats.level.toString());
    localStorage.setItem('userXp', stats.xp.toString());
    localStorage.setItem('blocosCompletos', JSON.stringify(stats.blocosCompletos));
    localStorage.setItem('userStreak', stats.streak.toString());
    localStorage.setItem('lastLoginDate', stats.lastLoginDate);
    localStorage.setItem('userHearts', stats.hearts.toString());
    localStorage.setItem('lastHeartTimestamp', stats.lastHeartTimestamp.toString());
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
    checkAchievements(stats, unlockedAchievements);
  }, [stats, unlockedAchievements, dailyQuests, checkAchievements]);

  const addXp = (amount: number) => {
    setStats(prevStats => {
      let newXp = prevStats.xp + amount;
      let newLevel = prevStats.level;
      let xpNeeded = calculateXpForLevel(newLevel);
      while (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel++;
        xpNeeded = calculateXpForLevel(newLevel);
        toast({ title: `🚀 Level Up!`, description: `Você alcançou o Nível ${newLevel}!`, className: 'bg-gradient-growth text-white border-none' });
      }
      return { ...prevStats, xp: Math.floor(newXp), level: newLevel };
    });
  };

  const loseHeart = () => {
      setStats(prev => {
          if (prev.hearts > 0) {
              const newTimestamp = prev.hearts === MAX_HEARTS ? Date.now() : prev.lastHeartTimestamp;
              return { ...prev, hearts: prev.hearts - 1, lastHeartTimestamp: newTimestamp };
          }
          return prev;
      });
  };

  const resetHearts = () => {
    const newHearts = MAX_HEARTS;
    localStorage.setItem('userHearts', newHearts.toString()); // Save immediately
    setStats(prev => ({ ...prev, hearts: newHearts }));
  };

  const completeBlock = (blocoId: string) => {
    setStats(prevStats => {
        if (prevStats.blocosCompletos.includes(blocoId)) {
            return prevStats;
        }
        addXp(10);
        return {
            ...prevStats,
            blocosCompletos: [...prevStats.blocosCompletos, blocoId]
        };
    });
  };

  const isBlockCompleted = (blocoId: string): boolean => {
      return stats.blocosCompletos.includes(blocoId);
  }

  const completeQuest = (questId: string) => {
      const quest = dailyQuests.find(q => q.id === questId);
      if (quest && !quest.isCompleted) {
        setDailyQuests(quests => quests.map(q => q.id === questId ? { ...q, isCompleted: true } : q));
        addXp(50);
        toast({ title: "Missão Cumprida!", description: "+50 XP", className: 'bg-blue-500 text-white border-none' });
      }
  };

  return {
    level: stats.level,
    xp: stats.xp,
    blocosCompletos: stats.blocosCompletos,
    streak: stats.streak,
    hearts: stats.hearts,
    xpForNextLevel,
    progressPercentage,
    allAchievements,
    unlockedAchievements,
    dailyQuests,
    addXp,
    loseHeart,
    resetHearts,
    completeBlock,
    isBlockCompleted,
    completeQuest,
  };
};
