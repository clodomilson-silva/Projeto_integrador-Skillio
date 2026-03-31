import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Play, Trophy, Users, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import mascot from "@/assets/mascot.png";
import TypedTextWithHighlight from './TypedTextWithHighlight';
import { useState, useEffect } from 'react';
import apiClient from '@/api/axios';
import { useAuth } from "@/contexts/AuthContext";

interface HeroStats {
  record: {
    holder: string | null;
    xp: number;
  };
  online_players: number;
}

const Hero = () => {
  const [stats, setStats] = useState<HeroStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Detecta se deve usar animação (monitora mudanças)
  useEffect(() => {
    const checkShouldAnimate = () => {
      // Verifica se Google Translate está ativo
      const isTranslated = 
        document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.classList.contains('translated-rtl') ||
        document.body.classList.contains('translated-ltr') ||
        document.body.classList.contains('translated-rtl');
      
      if (isTranslated) {
        console.log('❌ Google Translate ativo - SEM animação');
        setShouldAnimate(false);
        return;
      }
      
      // Verifica idioma do navegador
      const browserLang = navigator.language.toLowerCase();
      const isPortuguese = browserLang.startsWith('pt');
      
      console.log('🌍 Navegador:', browserLang, '| Animação:', isPortuguese ? 'SIM' : 'NÃO');
      setShouldAnimate(isPortuguese);
    };

    // Verifica imediatamente
    checkShouldAnimate();

    // Monitora mudanças nas classes do documento
    const observer = new MutationObserver(checkShouldAnimate);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class']
    });
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleStartPlaying = () => {
    if (isAuthenticated) {
      navigate('/trilha');
    } else {
      navigate('/login?redirect=/trilha');
    }
  };

  // Busca inicial do recorde via REST
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await apiClient.get<HeroStats>('/hero-stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setStats({ record: { holder: null, xp: 0 }, online_players: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, []);

  // WebSocket para atualizar jogadores online em tempo real
  useEffect(() => {
    const getWsUrl = () => {
      const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
      if (apiUrl) {
        // ex: "https://api.skillio.com/api/v1" → "wss://api.skillio.com/ws/online-players/"
        const origin = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
        return origin
          .replace(/^https:\/\//, 'wss://')
          .replace(/^http:\/\//, 'ws://')
          + '/ws/online-players/';
      }
      // Desenvolvimento local
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.hostname}:8000/ws/online-players/`;
    };

    const ws = new WebSocket(getWsUrl());

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.online_players === 'number') {
          setStats((prev) => ({
            ...(prev ?? { record: { holder: null, xp: 0 } }),
            online_players: data.online_players,
          }));
        }
      } catch {
        // ignora mensagens inválidas
      }
    };

    ws.onerror = () => {
      console.warn('WebSocket de jogadores online indisponível');
    };

    return () => ws.close();
  }, []);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-40"></div>
      
      {/* Gradient blur orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Plataforma Educacional Gamificada</span>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              {shouldAnimate ? (
                <TypedTextWithHighlight
                  text="Aprenda Brincando com o Skillio"
                  highlightWord="Skillio"
                  highlightClassName="text-gradient-primary"
                  speed={75}
                />
              ) : (
                <span>
                  Aprenda Brincando com o <span className="text-gradient-primary">Skillio</span>
                </span>
              )}
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Transforme seus estudos em uma <span className="text-foreground font-semibold">aventura emocionante</span>. 
              Jogue, aprenda e conquiste conhecimento em diversas disciplinas.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                variant="game" 
                size="lg" 
                className="text-lg px-10 h-14 shadow-glow hover:shadow-orange-glow hover-lift transition-smooth group"
                onClick={handleStartPlaying}
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Começar a Jogar
              </Button>
              <Link to="/quiz-rapido" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-10 h-14 w-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-smooth hover-lift"
                >
                  Quiz Rápido
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 justify-center lg:justify-start pt-6">
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary">100</div>
                <div className="text-sm text-muted-foreground font-medium">Disciplinas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary">+1000</div>
                <div className="text-sm text-muted-foreground font-medium">Perguntas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary">∞</div>
                <div className="text-sm text-muted-foreground font-medium">Diversão</div>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-8">
            {/* Main card with glass effect */}
            <div className="glass rounded-3xl p-10 text-center shadow-elevated hover:shadow-glow transition-smooth hover-lift">
              {/* Mascot */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 rounded-full"></div>
                <img 
                  src={mascot} 
                  alt="Skillio Mascot" 
                  className="w-80 h-80 md:w-96 md:h-96 mx-auto object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
              
              {/* Stats cards */}
              <div className="space-y-4">
                <Link to="/ranking" className="block">
                  <div className="group glass rounded-xl p-5 hover:bg-card/60 transition-smooth hover-lift cursor-pointer border border-border/50 hover:border-warning/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors">
                          <Trophy className="h-6 w-6 text-warning" />
                        </div>
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="font-semibold text-foreground">Carregando...</span>
                          </div>
                        ) : stats?.record.holder ? (
                          <div className="text-left">
                            <div className="text-sm text-muted-foreground font-medium">Recorde Atual</div>
                            <div className="font-bold text-foreground">{stats.record.holder} • {stats.record.xp} XP</div>
                          </div>
                        ) : (
                          <span className="font-semibold text-foreground">Seja o primeiro no ranking!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/ranking" className="block">
                  <div className="group glass rounded-xl p-5 hover:bg-card/60 transition-smooth hover-lift cursor-pointer border border-border/50 hover:border-accent/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Users className="h-6 w-6 text-accent" />
                        </div>
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="font-semibold text-foreground">Carregando...</span>
                          </div>
                        ) : (
                          <div className="text-left">
                            <div className="text-sm text-muted-foreground font-medium">Jogadores Online</div>
                            <div className="font-bold text-foreground">{stats?.online_players || 0} ativos agora</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;