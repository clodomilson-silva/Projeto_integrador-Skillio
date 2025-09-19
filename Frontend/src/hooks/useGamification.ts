import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allAchievements, Achievement } from '@/data/achievements';

const calculateXpForLevel = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

interface UserStats {
  xp: number;
  level: number;
  quizzesCompleted: number;
  streak: number;
  lastLoginDate: string; // ISO string
}

// Mock data for quests
export interface Quest {
    id: string;
    description: string;
    isCompleted: boolean;
}

const getDailyQuests = (): Quest[] => [
    { id: 'quest1', description: 'Complete 1 quiz de qualquer matéria', isCompleted: false },
    { id: 'quest2', description: 'Acerte 10 perguntas', isCompleted: false },
    { id: 'quest3', description: 'Passe 15 minutos aprendendo', isCompleted: false },
];

export const useGamification = () => {
  const { toast } = useToast();

  const [stats, setStats] = useState<UserStats>(() => {
    const savedXp = parseInt(localStorage.getItem('userXp') || '0', 10);
    const savedLevel = parseInt(localStorage.getItem('userLevel') || '1', 10);
    const savedQuizzes = parseInt(localStorage.getItem('quizzesCompleted') || '0', 10);
    const savedStreak = parseInt(localStorage.getItem('userStreak') || '0', 10);
    const savedLastLogin = localStorage.getItem('lastLoginDate') || new Date(0).toISOString();
    return { xp: savedXp, level: savedLevel, quizzesCompleted: savedQuizzes, streak: savedStreak, lastLoginDate: savedLastLogin };
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyQuests, setDailyQuests] = useState<Quest[]>(() => {
      const saved = localStorage.getItem('dailyQuests');
      // If it's a new day, reset quests
      const lastQuestDate = localStorage.getItem('questsDate');
      const todayStr = new Date().toDateString();
      if (lastQuestDate !== todayStr) {
          localStorage.setItem('questsDate', todayStr);
          return getDailyQuests();
      }
      return saved ? JSON.parse(saved) : getDailyQuests();
  });

  const xpForNextLevel = calculateXpForLevel(stats.level);
  const progressPercentage = Math.max(0, Math.min(100, (stats.xp / xpForNextLevel) * 100));

  const checkAchievements = useCallback((currentStats: UserStats, currentUnlocked: string[]) => {
    const newlyUnlocked: Achievement[] = [];
    allAchievements.forEach((achievement) => {
      const isAlreadyUnlocked = currentUnlocked.includes(achievement.id);
      if (!isAlreadyUnlocked && achievement.criteria(currentStats)) {
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

  // Effect for handling streak logic on initial load
  useEffect(() => {
    const today = new Date();
    const lastLogin = new Date(stats.lastLoginDate);
    const oneDay = 1000 * 60 * 60 * 24;

    const isSameDay = today.toDateString() === lastLogin.toDateString();
    if (isSameDay) return;

    const diffTime = today.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffTime / oneDay);

    let newStreak = stats.streak;
    if (diffDays === 1) {
      newStreak++;
      toast({ title: "🔥 Sequência Mantida!", description: `Você está há ${newStreak} dias seguidos!`, className: 'bg-orange-500 text-white border-none' });
    } else {
      newStreak = 1;
    }
    
    setStats(prev => ({ ...prev, streak: newStreak, lastLoginDate: today.toISOString() }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('userLevel', stats.level.toString());
    localStorage.setItem('userXp', stats.xp.toString());
    localStorage.setItem('quizzesCompleted', stats.quizzesCompleted.toString());
    localStorage.setItem('userStreak', stats.streak.toString());
    localStorage.setItem('lastLoginDate', stats.lastLoginDate);
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

  const completeQuiz = () => {
    setStats(prevStats => ({ ...prevStats, quizzesCompleted: prevStats.quizzesCompleted + 1 }));
    addXp(100);
  };

  const completeQuest = (questId: string) => {
      const quest = dailyQuests.find(q => q.id === questId);
      if (quest && !quest.isCompleted) {
        setDailyQuests(quests => quests.map(q => q.id === questId ? { ...q, isCompleted: true } : q));
        addXp(50); // Award 50 XP for completing a quest
        toast({ title: "Missão Cumprida!", description: "+50 XP", className: 'bg-blue-500 text-white border-none' });
      }
  };

  return {
    level: stats.level,
    xp: stats.xp,
    quizzesCompleted: stats.quizzesCompleted,
    streak: stats.streak,
    xpForNextLevel,
    progressPercentage,
    allAchievements,
    unlockedAchievements,
    dailyQuests,
    addXp,
    completeQuiz,
    completeQuest,
  };
};