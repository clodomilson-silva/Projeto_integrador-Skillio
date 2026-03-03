import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import resolveAvatarSrc from '@/lib/avatar';
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { RankedUser, useRanking } from "@/hooks/useRanking";
import { cn } from "@/lib/utils";
import { ArrowLeft, Crown, Loader2, Medal, Star, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1: return <Crown className="h-8 w-8 text-yellow-400" />;
    case 2: return <Medal className="h-7 w-7 text-gray-300" />;
    case 3: return <Star className="h-6 w-6 text-amber-500" />;
    default: return <span className="text-xl font-bold text-muted-foreground">{position}</span>;
  }
};

const RankingCard = ({ player, isCurrentUser }: { player: RankedUser, isCurrentUser: boolean }) => (
  <Link to={`/profile/${player.id}`}>
    <GameCard className={`p-4 transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${isCurrentUser ? 'border-2 border-primary shadow-lg' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-10 h-10">{getPositionIcon(player.rank)}</div>
          <Avatar className="w-12 h-12">
            <AvatarImage src={resolveAvatarSrc(player.avatar)} alt={player.name} className="object-cover" />
            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className={`font-bold ${isCurrentUser ? 'text-primary' : ''}`}>{player.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="w-4 h-4 text-amber-400" /><span>Nível {player.level}</span></div>
          </div>
        </div>
        <div className="text-right"><div className="font-bold text-lg">{player.xp.toLocaleString()} XP</div></div>
      </div>
    </GameCard>
  </Link>
);

const RankingList = ({ ranking, loading, error, currentUser, totalUsers }: { ranking: RankedUser[]; loading: boolean; error: string | null; currentUser: string; totalUsers: number }) => {
  if (loading) return (<div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>);
  if (error) return (<div className="text-center py-8"><p className="text-red-500 mb-4">{error}</p><Button onClick={() => window.location.reload()}>Tentar Novamente</Button></div>);

  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">Total de jogadores: {totalUsers}</p>

      {podium.length > 0 && (
        <>
          {/* Desktop: pódio visual com alturas diferentes */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 mb-8 items-end">
            {/* 2º lugar - esquerda */}
            {podium[1] ? (
              <div className="flex justify-center">
                <Link to={`/profile/${podium[1].id}`} className="w-full max-w-xs">
                  <GameCard className="p-6 text-center border-2 border-gray-300 hover:scale-105 transition-transform cursor-pointer podium-2 h-56">
                    <div className="mb-2">{getPositionIcon(2)}</div>
                    <Avatar className="w-16 h-16 mx-auto mb-2"><AvatarImage src={resolveAvatarSrc(podium[1].avatar)} alt={podium[1].name} className="object-cover" /><AvatarFallback className="text-xl">{podium[1].name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar>
                    <h3 className="font-bold text-base">{podium[1].name}</h3>
                    <p className="text-xs text-muted-foreground">Nível {podium[1].level}</p>
                    <p className="text-lg font-bold mt-1">{podium[1].xp.toLocaleString()} XP</p>
                  </GameCard>
                </Link>
              </div>
            ) : <div />}

            {/* 1º lugar - centro (maior) */}
            {podium[0] ? (
              <div className="flex justify-center">
                <Link to={`/profile/${podium[0].id}`} className="w-full max-w-xl">
                  <GameCard className="p-8 text-center border-2 border-yellow-400 hover:scale-105 transition-transform cursor-pointer podium-1 h-72">
                    <div className="mb-3">{getPositionIcon(1)}</div>
                    <Avatar className="w-24 h-24 mx-auto mb-3"><AvatarImage src={resolveAvatarSrc(podium[0].avatar)} alt={podium[0].name} className="object-cover" /><AvatarFallback className="text-2xl">{podium[0].name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar>
                    <h3 className="font-bold text-lg">{podium[0].name}</h3>
                    <p className="text-sm text-muted-foreground">Nível {podium[0].level}</p>
                    <p className="text-xl font-bold mt-1">{podium[0].xp.toLocaleString()} XP</p>
                  </GameCard>
                </Link>
              </div>
            ) : <div />}

            {/* 3º lugar - direita */}
            {podium[2] ? (
              <div className="flex justify-center">
                <Link to={`/profile/${podium[2].id}`} className="w-full max-w-xs">
                  <GameCard className="p-5 text-center border-2 border-amber-500 hover:scale-105 transition-transform cursor-pointer podium-3 h-52">
                    <div className="mb-1">{getPositionIcon(3)}</div>
                    <Avatar className="w-14 h-14 mx-auto mb-1"><AvatarImage src={resolveAvatarSrc(podium[2].avatar)} alt={podium[2].name} className="object-cover" /><AvatarFallback className="text-lg">{podium[2].name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar>
                    <h3 className="font-bold text-sm">{podium[2].name}</h3>
                    <p className="text-xs text-muted-foreground">Nível {podium[2].level}</p>
                    <p className="text-base font-bold mt-1">{podium[2].xp.toLocaleString()} XP</p>
                  </GameCard>
                </Link>
              </div>
            ) : <div />}
          </div>

          {/* Mobile: lista vertical do 1º ao 3º */}
          <div className="flex flex-col gap-3 mb-6 md:hidden">
            {podium.map((player) => (
              <RankingCard key={player.id} player={player} isCurrentUser={currentUser === player.name || currentUser === player.username} />
            ))}
          </div>
        </>
      )}

      <div className="space-y-3">
        {rest.map((player) => (
          <RankingCard key={player.id} player={player} isCurrentUser={currentUser === player.name || currentUser === player.username} />
        ))}
      </div>
    </div>
  );
};

const Ranking = () => {
  const [selectedTab, setSelectedTab] = useState("global");
  const { user } = useAuth();
  const { ranking, loading, error, totalUsers } = useRanking(selectedTab);
  const tabs = [
    { value: "global", label: "Global" },
    { value: "mensal", label: "Mensal" },
    { value: "semanal", label: "Semanal" },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    // função mantida para compatibilidade futura, atualmente sem uso
    return;
  };

  const currentUser = user?.username || '';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/"><Button variant="ghost" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2"/>Voltar ao Início</Button></Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><Trophy className="inline-block h-10 w-10 text-amber-400 mb-2"/> Ranking de Jogadores</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Veja os melhores jogadores e compare seu desempenho com outros estudantes!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!user && (
            <div className="mb-6 text-center"><GameCard className="p-4 bg-primary/5 border-primary/20"><p className="text-sm text-muted-foreground">💡 <Link to="/register" className="text-primary font-semibold hover:underline">Crie sua conta</Link> para aparecer no ranking!</p></GameCard></div>
          )}

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex justify-center">
              <TabsList className="inline-flex h-auto p-1">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className={cn("text-lg py-2 px-4 transition-all duration-300", selectedTab === tab.value && "bg-primary text-primary-foreground shadow-md scale-105")}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <RankingList ranking={ranking} loading={loading} error={error} currentUser={currentUser} totalUsers={totalUsers} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
