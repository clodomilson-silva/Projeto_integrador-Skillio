import { GameCard } from "@/components/ui/game-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Trophy, 
  Calendar,
  Star,
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Palette,
  Zap,
  Target,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useGamification } from '@/hooks/useGamification'; // The one hook to rule them all

// Mock data, can be removed later
const subjectStats = [
  { id: "matematica", name: "Matemática", icon: Calculator, bestScore: 2450, gamesPlayed: 35, accuracy: 82, level: 3 },
  { id: "portugues", name: "Português", icon: BookOpen, bestScore: 1890, gamesPlayed: 28, accuracy: 75, level: 2 },
  { id: "ciencias", name: "Ciências", icon: Atom, bestScore: 3200, gamesPlayed: 22, accuracy: 68, level: 4 },
];
const recentGames = [
  { subject: "Matemática", score: 1250, date: "Hoje", accuracy: 80 },
  { subject: "Português", score: 980, date: "Ontem", accuracy: 75 },
];

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpen: <BookOpen className="h-10 w-10" />,
  Star: <Star className="h-10 w-10" />,
  Zap: <Zap className="h-10 w-10" />,
  Target: <Target className="h-10 w-10" />,
};

const Profile = () => {
  const {
    level,
    xp,
    quizzesCompleted,
    xpForNextLevel,
    progressPercentage,
    allAchievements,
    unlockedAchievements,
    addXp,
    completeQuiz,
  } = useGamification();

  const [userInfo, setUserInfo] = useState({ name: '', email: '', joinDate: '...' });

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Usuário';
    const email = localStorage.getItem('userEmail') || '';
    setUserInfo({ name, email, joinDate: 'Setembro 2025' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meu{" "}<span className="bg-gradient-primary bg-clip-text text-transparent">Perfil</span>
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <GameCard variant="subject" className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={undefined} />
                <AvatarFallback className="text-2xl">{userInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-2">{userInfo.name}</h2>
              <p className="text-muted-foreground mb-4">{userInfo.email}</p>
              
              <div className="flex justify-center items-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-bold">Nível {level}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span>{xp} XP</span>
                  <span>{xpForNextLevel} XP</span>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-primary/20" />
              </div>
              
              <Badge variant="secondary" className="mt-4">
                <Calendar className="h-3 w-3 mr-1" />Membro desde {userInfo.joinDate}
              </Badge>
            </GameCard>

            <GameCard className="p-6">
              <h3 className="text-lg font-bold mb-4">Estatísticas Gerais</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quizzes Completos</span>
                  <span className="font-bold">{quizzesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conquistas</span>
                  <span className="font-bold">{unlockedAchievements.length} / {allAchievements.length}</span>
                </div>
              </div>
            </GameCard>

            <GameCard className="p-6">
              <h3 className="text-lg font-bold mb-4">Ações de Teste</h3>
              <div className="flex flex-col gap-2">
                 <Button onClick={() => addXp(50)} variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" /> Adicionar 50 XP
                </Button>
                <Button onClick={() => completeQuiz()} variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" /> Completar um Quiz
                </Button>
              </div>
            </GameCard>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Conquistas</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {allAchievements.map((achievement) => {
                  const isEarned = unlockedAchievements.includes(achievement.id);
                  const iconNode = iconMap[achievement.icon];
                  return (
                    <GameCard key={achievement.id} className={`p-4 transition-all ${isEarned ? 'border-green-500/50' : 'opacity-50'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 flex items-center justify-center rounded-lg ${isEarned ? 'bg-green-500/20 text-green-400' : 'bg-muted'}`}>
                          {React.cloneElement(iconNode as React.ReactElement, { className: "h-8 w-8" })}
                        </div>
                        <div>
                          <h3 className="font-bold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </GameCard>
                  );
                })}
              </div>
            </div>
            
            {/* Other sections like Subject Performance can remain here */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
