import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { CalendarioAtividades } from "@/components/ui/CalendarioAtividades";
import { useGamification } from "@/hooks/useGamification";
import { Flame, Star, Trophy } from "lucide-react";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

// Mock data for chart - can be replaced with real data later
const estatisticasAvancadas = {
  materias: [
    { nome: "Matemática", acertos: 30, erros: 5 },
    { nome: "Português", acertos: 20, erros: 10 },
    { nome: "História", acertos: 15, erros: 8 },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuário');
  const {
    level,
    xp,
    streak,
    dailyQuests,
    completeQuest
  } = useGamification();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img src={`https://api.dicebear.com/8.x/adventurer/tsx?seed=${userName}`} alt="Foto de perfil" className="w-20 h-20 rounded-full border-2 border-primary shadow-glow object-cover" />
        <div className="flex-1">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Bem-vindo, {userName}!</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <span className="flex items-center text-base text-muted-foreground"><Star className="w-4 h-4 mr-1 text-amber-400"/>Nível: <b className="ml-1 text-primary">{level}</b></span>
            <span className="flex items-center text-base text-muted-foreground"><Trophy className="w-4 h-4 mr-1 text-amber-400"/>Pontos: <b className="ml-1 text-primary">{xp} XP</b></span>
            {streak > 0 && <span className="flex items-center text-base text-muted-foreground"><Flame className="w-4 h-4 mr-1 text-orange-500"/>Sequência: <b className="ml-1 text-orange-500">{streak} dias</b></span>}
          </div>
        </div>
        <Button size="lg" className="bg-gradient-knowledge shadow-glow" onClick={() => navigate("/subjects")}>Iniciar Exercício</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 flex flex-col gap-2">
                <span className="text-lg font-semibold mb-2">Desempenho por Matéria (%)</span>
                <div style={{ height: 220, width: '100%', margin: '0 auto' }}>
                    <Bar
                    data={{
                        labels: estatisticasAvancadas.materias.map(m => m.nome),
                        datasets: [
                        {
                            label: 'Acertos (%)',
                            data: estatisticasAvancadas.materias.map(m => {
                            const total = m.acertos + m.erros;
                            return total ? Math.round((m.acertos / total) * 100) : 0;
                            }),
                            backgroundColor: '#22c55e',
                        },
                        {
                            label: 'Erros (%)',
                            data: estatisticasAvancadas.materias.map(m => {
                            const total = m.acertos + m.erros;
                            return total ? Math.round((m.erros / total) * 100) : 0;
                            }),
                            backgroundColor: '#ef4444',
                        },
                        ],
                    }}
                    options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, max: 100 } } }}
                    />
                </div>
            </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Missões Diárias</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {dailyQuests.map(quest => (
                        <div key={quest.id} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${quest.isCompleted ? 'bg-green-500/10' : 'bg-muted/50'}`}>
                            <Checkbox id={quest.id} checked={quest.isCompleted} disabled className="data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500" />
                            <label htmlFor={quest.id} className={`flex-1 text-sm ${quest.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                {quest.description}
                            </label>
                            {!quest.isCompleted && <Button size="sm" variant="outline" onClick={() => completeQuest(quest.id)}>+50 XP</Button>}
                        </div>
                    ))}
                </CardContent>
            </Card>
            <CalendarioAtividades />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
