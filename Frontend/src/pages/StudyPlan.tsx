import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { trilhaPrincipal } from '@/data/trilhaPrincipal';

const StudyPlan = () => {
  const [plan, setPlan] = useState('');
  const [isRefazerAtivo, setIsRefazerAtivo] = useState(false);
  const navigate = useNavigate();
  const { level, blocosCompletos } = useGamification();

  useEffect(() => {
    const savedPlan = localStorage.getItem('studyPlanMarkdown');
    if (savedPlan) {
      setPlan(savedPlan);
    } else {
      setPlan('Nenhum plano de estudo encontrado. Por favor, complete o quiz de nivelamento primeiro.');
    }

    const nivelAtualData = trilhaPrincipal.find(n => n.nivel === level);
    if (nivelAtualData) {
      const todosBlocosCompletos = nivelAtualData.blocos.every(bloco => blocosCompletos.includes(bloco.id));
      setIsRefazerAtivo(todosBlocosCompletos);
    } else {
      setIsRefazerAtivo(false);
    }

  }, [level, blocosCompletos]);

  const handleRefazerNivelamento = () => {
    navigate('/quiz-nivelamento');
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </Link>

      <main className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
              Meu Plano de Estudo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-left prose-headings:font-semibold prose-h3:text-lg prose-h4:text-base">
                <Markdown>{plan}</Markdown>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* O div é necessário para o tooltip funcionar em um botão desativado */}
                    <div className="inline-block">
                        <Button 
                            size="lg" 
                            onClick={handleRefazerNivelamento} 
                            disabled={!isRefazerAtivo}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refazer Nivelamento
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {isRefazerAtivo ? (
                        <p>Parabéns! Você completou o nível e pode refazer o nivelamento para ajustar seu plano.</p>
                    ) : (
                        <p>Complete todos os 15 blocos do seu nível atual para refazer o nivelamento.</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;