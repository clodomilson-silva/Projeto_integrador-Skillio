import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/api/axios';
import { allAchievements } from '../data/achievements';

// Interfaces
export interface UserGamificationStats {
    level: number;
    xp: number;
    streak: number;
}

export interface UserAchievement {
    achievement: { id: string; name: string; description: string; icon: string; };
    unlocked_at: string;
}

export interface Quest {
    quest: { id: string; description: string; xp_reward: number; };
    quest_date: string;
    is_completed: boolean;
}

// Context Type
interface GamificationContextType {
    level: number;
    xp: number;
    streak: number;
    unlockedAchievements: string[];
    dailyQuests: Quest[];
    blocosCompletos: string[];
    isLoading: boolean;
    xpForNextLevel: number;
    progressPercentage: number;
    hearts: number;
    addXp: (amount: number) => Promise<void>;
    completeQuest: (questId: string) => Promise<void>;
    loseHeart: () => void;
    resetHearts: () => void;
    refetchGamificationData: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Provider Component
export const GamificationProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const { isAuthenticated } = useAuth();

    const [stats, setStats] = useState<UserGamificationStats>({ level: 1, xp: 0, streak: 0 });
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
    const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
    const [blocosCompletos, setBlocosCompletos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('userHearts') || '5', 10));

    const fetchGamificationData = useCallback(async () => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await apiClient.get('/users/me/');
            const { data } = response;
            if (data.profile) {
                setStats(data.profile.gamification || { level: 1, xp: 0, streak: 0 });
                setUnlockedAchievements((data.profile.achievements || []).map((ua: UserAchievement) => ua.achievement.id));
                setDailyQuests(data.profile.daily_quests || []);
                setBlocosCompletos(data.profile.blocos_completos || []);
            }
        } catch (error) {
            console.error("Failed to fetch gamification data", error);
            toast({ title: "Erro de Gamificação", description: "Não foi possível buscar seus dados de progresso.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, toast]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchGamificationData();
        } else {
            setIsLoading(false);
            setStats({ level: 1, xp: 0, streak: 0 });
            setUnlockedAchievements([]);
            setDailyQuests([]);
            setBlocosCompletos([]);
        }
    }, [isAuthenticated, fetchGamificationData]);

    const xpForNextLevel = Math.floor(100 * Math.pow(stats.level, 1.5));
    const progressPercentage = xpForNextLevel > 0 ? Math.max(0, Math.min(100, (stats.xp / xpForNextLevel) * 100)) : 0;

    const addXp = useCallback(async (amount: number) => {
        if (!isAuthenticated) return;
        try {
            const response = await apiClient.post('/study/gamification/add-xp/', { amount });
            const { level_up, new_level } = response.data;
            if (level_up) {
                toast({ title: `🚀 Level Up!`, description: `Você alcançou o Nível ${new_level}!`, className: 'bg-gradient-growth text-white border-none' });
            }
            fetchGamificationData();
        } catch (error) {
            console.error("Failed to add XP", error);
        }
    }, [isAuthenticated, fetchGamificationData, toast]);

    const completeQuest = async (questId: string) => {
        if (!isAuthenticated) return;
        const quest = dailyQuests.find(q => q.quest.id === questId);
        if (quest && !quest.is_completed) {
            try {
                await apiClient.post(`/study/my-daily-quests/${questId}/complete/`);
                toast({ title: "Missão Cumprida!", description: `+${quest.quest.xp_reward} XP`, className: 'bg-blue-500 text-white border-none' });
                fetchGamificationData();
            } catch (error) {
                console.error("Failed to complete quest", error);
            }
        }
    };

    const loseHeart = () => {
        const newHearts = Math.max(0, hearts - 1);
        setHearts(newHearts);
        localStorage.setItem('userHearts', String(newHearts));
    };

    const resetHearts = () => {
        setHearts(5);
        localStorage.setItem('userHearts', '5');
    };

    const value = {
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
        resetHearts,
        refetchGamificationData: fetchGamificationData,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

// Hook
export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};