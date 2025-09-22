import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, Pause, X, RotateCcw, BookOpen, CheckCircle, HeartCrack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGenerativeAI } from "@/hooks/useGenerativeAI";
import { trilhaPrincipal } from "@/data/trilhaPrincipal";
import { useGamification } from "@/hooks/useGamification";
import { useTimeTracker } from "@/hooks/useTimeTracker";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
}

const Game = () => {
  const { blocoId } = useParams<{ blocoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addXp, completeBlock, isBlockCompleted, loseHeart, hearts } = useGamification();
  useTimeTracker(); // Inicia o rastreamento de tempo nesta página

  const nivel = new URLSearchParams(location.search).get('nivel');
  const blocoInfo = trilhaPrincipal.flatMap(n => n.blocos).find(b => b.id === blocoId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const educationalLevel = localStorage.getItem('userEducationalLevel') || 'medio';
  const userFocus = localStorage.getItem('userFocus') || 'Conhecimentos Gerais';

  const subject = blocoInfo?.tipo === 'foco' ? userFocus : 'Conhecimentos Gerais';

  const { generatedQuestions, loading, error, refetch } = useGenerativeAI(
    subject,
    educationalLevel,
    nivel ? parseInt(nivel, 10) : 1
  );

  const questions: Question[] = generatedQuestions;

  useEffect(() => {
    // Impede o início do jogo se o usuário não tiver vidas e o bloco não estiver completo
    if (hearts <= 0 && blocoId && !isBlockCompleted(blocoId)) {
        toast({ title: "Sem vidas!", description: "Você precisa de vidas para começar um novo bloco.", variant: "destructive" });
        navigate('/trilha');
    }
  }, [hearts, blocoId, isBlockCompleted, navigate, toast]);

  const handleAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestion]?.correct;
    if (isCorrect) {
      addXp(5);
      toast({ title: "Correto! 🎉", description: `+5 XP` });
    } else {
      loseHeart();
      if (answerIndex === -1) {
        toast({ title: "Tempo esgotado! ⏰", variant: "destructive" });
      } else {
        toast({ title: "Incorreto 😔", description: "Você perdeu uma vida.", variant: "destructive" });
      }
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(30);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameOver(true);
      }
    }, 2000);
  }, [currentQuestion, questions, addXp, toast, loseHeart]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameOver && !isPaused && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleAnswer(-1);
    }
  }, [timeLeft, showResult, gameOver, isPaused, questions, handleAnswer]);

  useEffect(() => {
    if (gameOver && blocoId) {
      if (!isBlockCompleted(blocoId)) {
        completeBlock(blocoId);
        toast({ title: "Bloco Concluído!", description: "+10 XP e conquista desbloqueada!" });
      }
    }
  }, [gameOver, blocoId, completeBlock, isBlockCompleted, toast]);

  const resetGame = () => {
      refetch();
      setCurrentQuestion(0);
      setScore(0);
      setTimeLeft(30);
      setSelectedAnswer(null);
      setShowResult(false);
      setGameOver(false);
      setIsPaused(false);
  };

  if (hearts <= 0 && blocoId && !isBlockCompleted(blocoId)) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <GameCard className="p-8 text-center">
                <HeartCrack className="h-16 w-16 mx-auto mb-6 text-destructive" />
                <h2 className="text-2xl font-bold mb-4">Você está sem vidas!</h2>
                <p className="text-muted-foreground mb-6">Volte mais tarde para continuar sua jornada. As vidas recarregam com o tempo.</p>
                <Button variant="game" onClick={() => navigate('/trilha')}>Voltar para a Trilha</Button>
            </GameCard>
        </div>
    );
  }

  if (!blocoInfo || !nivel) {
      return <div className="text-center p-8">Bloco não encontrado.</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GameCard className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Carregando perguntas...</h2>
          <Progress value={undefined} className="h-3 w-full animate-pulse" />
        </GameCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GameCard className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar perguntas</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="game" onClick={() => refetch()}>Tentar Novamente</Button>
        </GameCard>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GameCard className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhuma pergunta encontrada para este bloco.</h2>
          <Link to="/trilha">
            <Button variant="game">Voltar para a Trilha</Button>
          </Link>
        </GameCard>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GameCard variant="subject" className="p-8 text-center max-w-md">
          <Trophy className="h-16 w-16 mx-auto mb-6 text-warning" />
          <h2 className="text-3xl font-bold mb-4">Bloco Finalizado!</h2>
          <div className="flex flex-col gap-4 mt-8">
              <Button variant="game" onClick={() => navigate('/trilha')} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Voltar para a Trilha
              </Button>
            <Button variant="outline" onClick={resetGame} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Jogar Novamente
            </Button>
          </div>
        </GameCard>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/trilha">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {blocoInfo.titulo}
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setIsPaused(!isPaused)}><Pause className="h-4 w-4" /></Button>
            <Link to="/trilha"><Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button></Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Pergunta {currentQuestion + 1} de {questions.length}</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Pontos:</span>
              <Badge variant="secondary" className="text-lg font-bold">{score}</Badge>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <GameCard variant={timeLeft > 10 ? "default" : "warning"} className="p-6 text-center">
            <Clock className={`h-8 w-8 mx-auto mb-2 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
            <div className="text-3xl font-bold">{timeLeft}</div>
            <div className="text-sm text-muted-foreground">segundos</div>
            {isPaused && <Badge variant="secondary" className="mt-2">Jogo Pausado</Badge>}
          </GameCard>
        </div>

        <div className="max-w-2xl mx-auto">
          <GameCard variant="subject" className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-center mb-8">{question.question}</h2>
            <div className="grid gap-4">
              {question.options.map((option: string, index: number) => {
                let variant: "default" | "success" | "destructive" = "default";
                if (showResult) {
                  if (index === question.correct) variant = "success";
                  else if (index === selectedAnswer) variant = "destructive";
                }
                return (
                  <Button
                    key={index}
                    variant={variant === "default" ? "outline" : variant}
                    className="h-16 text-lg justify-start px-6"
                    onClick={() => !showResult && !isPaused && handleAnswer(index)}
                    disabled={showResult || isPaused}
                  >
                    <span className="font-bold mr-4">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </Button>
                );
              })}
            </div>
          </GameCard>
        </div>
      </div>
    </div>
  );
};

export default Game;