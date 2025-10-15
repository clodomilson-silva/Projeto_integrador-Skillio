import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/api/axios';

// Interfaces based on existing hooks
export interface Quest {
    quest: { id: string; description: string; xp_reward: number; };
    quest_date: string;
    is_completed: boolean;
}
export interface AreaPerformance {
    area_name: string;
    subjects: { subject_name: string; correct_answers: number; incorrect_answers: number; }[];
}
export interface Activity {
  date: string;
  type: 'pratica' | 'falha';
}
export interface UserData {
  first_name: string;
  profile: {
    foto: string | null;
  };
}

export interface DashboardData {
  userData: UserData | null;
  gamification: {
    level: number;
    xp: number;
    streak: number;
    dailyQuests: Quest[];
    blocosCompletos: string[];
  } | null;
  performanceData: AreaPerformance[] | null;
  activities: Activity[] | null;
}

export const useDashboardData = () => {
    const { isAuthenticated } = useAuth();
    const [data, setData] = useState<DashboardData>({
        userData: null,
        gamification: null,
        performanceData: null,
        activities: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);


    const fetchData = useCallback(async () => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const [userResponse, activityResponse] = await Promise.all([
                apiClient.get('/users/me/'),
                apiClient.get('/activity-log/')
            ]);

            const userData = userResponse.data;
            const activityData = activityResponse.data;

            setData({
                userData: {
                    first_name: userData.first_name,
                    profile: userData.profile,
                },
                gamification: userData.profile?.gamification ? {
                    level: userData.profile.gamification.level,
                    xp: userData.profile.gamification.xp,
                    streak: userData.profile.gamification.streak,
                    dailyQuests: userData.profile.daily_quests || [],
                    blocosCompletos: userData.profile.blocos_completos || [],
                } : { level: 1, xp: 0, streak: 0, dailyQuests: [], blocosCompletos: [] },
                performanceData: userData.performance || [],
                activities: activityData || [],
            });

        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...data, isLoading, error, refetchData: fetchData };
};
