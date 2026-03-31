import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Lock } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center py-12 px-4">
      <div className="container mx-auto max-w-md">
        <GameCard className="p-8 text-center space-y-6">
          <div className="inline-block p-4 rounded-full bg-red-500/10">
            <Lock className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-5xl font-extrabold text-primary mb-2">404</h1>
          <p className="text-lg text-muted-foreground mb-4">Ops! Página não encontrada</p>
          <p className="text-sm text-secondary mb-6">A rota <span className="font-mono bg-secondary/10 px-2 py-1 rounded">{location.pathname}</span> não existe ou foi removida.</p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-gradient-to-r from-primary to-primary/80"
            size="lg"
          >
            Voltar para Home
          </Button>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda? <a href="/suporte" className="text-primary font-semibold hover:underline ml-1">Fale conosco</a>
            </p>
          </div>
        </GameCard>
      </div>
    </div>
  );
};

export default NotFound;
