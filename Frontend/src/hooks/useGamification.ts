import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/api/axios';
import { allAchievements } from '../data/achievements';

// Interfaces baseadas nos serializers do Django
interface UserGamificationStats {
    level: number;
    xp: number;
    streak: number;
}

interface UserAchievement {
    achievement: { id: string; name: string; description: string; icon: string; };
    unlocked_at: string;
}

interface Quest {
    quest: { id: string; description: string; xp_reward: number; };
    quest_date: string;
    is_completed: boolean;
}

export const useGamification = () => {
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();

    const [stats, setStats] = useState<UserGamificationStats>({ level: 1, xp: 0, streak: 0 });
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
    const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
    const [blocosCompletos, setBlocosCompletos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const xpForNextLevel = Math.floor(100 * Math.pow(stats.level, 1.5));
    const progressPercentage = Math.max(0, Math.min(100, (stats.xp / xpForNextLevel) * 100));

    const fetchInitialData = useCallback(async () => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            // Usaremos o endpoint de /users/me/ que já retorna os dados de gamificação
            const response = await apiClient.get('/users/me/');
            const { data } = response;

            if (data.profile.gamification) {
                setStats(data.profile.gamification);
            }

            if (data.profile.achievements) {
                setUnlockedAchievements(data.profile.achievements.map((ua: UserAchievement) => ua.achievement.id));
            }

            if (data.profile.daily_quests) {
                setDailyQuests(data.profile.daily_quests);
            }

            if (data.profile.blocos_completos) {
                setBlocosCompletos(data.profile.blocos_completos);
            }

        } catch (error) {
            console.error("Failed to fetch gamification data", error);
            toast({ title: "Erro ao carregar dados", description: "Não foi possível buscar seus dados de progresso.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, toast]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const addXp = useCallback(async (amount: number) => {
        try {
            const response = await apiClient.post('/study/gamification/add-xp/', { amount });
            const { new_level, new_xp, level_up } = response.data;
            
            setStats(prev => ({ ...prev, level: new_level, xp: new_xp }));

            if (level_up) {
                toast({ 
                    title: `🚀 Level Up!`, 
                    description: `Você alcançou o Nível ${new_level}!`, 
                    className: 'bg-gradient-growth text-white border-none' 
                });
            }
        } catch (error) {
            console.error("Failed to add XP", error);
        }
    }, [toast]);

    const completeQuest = async (questId: string) => {
        const quest = dailyQuests.find(q => q.quest.id === questId);
        if (quest && !quest.is_completed) {
            try {
                await apiClient.post(`/study/my-daily-quests/${questId}/complete/`);
                setDailyQuests(quests => quests.map(q => q.quest.id === questId ? { ...q, is_completed: true } : q));
                toast({ title: "Missão Cumprida!", description: `+${quest.quest.xp_reward} XP`, className: 'bg-blue-500 text-white border-none' });
                // O XP é adicionado no backend, então podemos apenas refetch ou atualizar manualmente
                fetchInitialData(); // Simples, mas eficaz
            } catch (error) {
                console.error("Failed to complete quest", error);
            }
        }
    };

    // Funções que ainda podem ser mantidas no frontend ou que precisam de mais endpoints
    const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('userHearts') || '5', 10));
    const loseHeart = () => {
        const newHearts = Math.max(0, hearts - 1);
        setHearts(newHearts);
        localStorage.setItem('userHearts', String(newHearts));
    };

    return {
        level: stats.level,
        xp: stats.xp,
        streak: stats.streak,
        allAchievements,
        unlockedAchievements,
        dailyQuests,
        blocosCompletos,
        isLoading,
        xpForNextLevel,
        progressPercentage,
        hearts,
        addXp,
        completeQuest,
        loseHeart,
    };
};