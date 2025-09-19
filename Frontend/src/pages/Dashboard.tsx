import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { CalendarioAtividades } from "@/components/ui/CalendarioAtividades";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

// Dados mockados avançados
const userData = {
  nome: "João Silva",
  fotoPerfil: "/assets/mascot.png",
  pontuacao: 1200,
  nivel: "Intermediário",
  areaFavorita: "Matemática",
  proximaAtividade: "Exercício de Matemática",
  posicaoRanking: 7,
  estatisticas: {
    acertos: 85,
    erros: 15,
    tempoEstudo: "2h 30min",
  },
};

const estatisticasAvancadas = {
  materias: [
    { nome: "Matemática", acertos: 30, erros: 5 },
    { nome: "Português", acertos: 20, erros: 10 },
    { nome: "História", acertos: 15, erros: 8 },
    { nome: "Geografia", acertos: 10, erros: 7 },
    { nome: "Física", acertos: 10, erros: 3 },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Exemplo: redirecionar se não estiver logado
    // if (!localStorage.getItem('userEmail')) navigate("/login");
  }, [navigate]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Dados do usuário */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img src={userData.fotoPerfil} alt="Foto de perfil" className="w-20 h-20 rounded-full border-2 border-primary shadow-glow object-cover" />
        <div className="flex-1">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{userData.nome}</h2>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="text-base text-muted-foreground">Foco de Aprendizagem: <span className="font-bold text-primary">{userData.areaFavorita}</span></span>
            <span className="text-base text-muted-foreground">Nível: <span className="font-bold text-gradient-knowledge">{userData.nivel}</span></span>
            <span className="text-base text-muted-foreground">Ranking: <span className="font-bold text-warning">#{userData.posicaoRanking}</span></span>
            <span className="text-base text-muted-foreground">Pontuação: <span className="font-bold text-primary">{userData.pontuacao}</span></span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigator.share ? navigator.share({ title: 'Meu progresso no EdGame', text: `Veja meu desempenho! Pontuação: ${userData.pontuacao}` }) : alert('Compartilhamento não suportado')}>Compartilhar</Button>
      </div>

      {/* Gráficos de desempenho */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <CalendarioAtividades />

        {/* Gráfico de barras: Acertos/Erros por matéria em % */}
        <Card className="p-6 flex flex-col gap-2 col-span-1 md:col-span-2">
          <span className="text-lg font-semibold mb-2">Desempenho por Matéria (%)</span>
          <div style={{ height: 220, width: '100%', maxWidth: 500, margin: '0 auto' }}>
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
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true, beginAtZero: true, max: 100 },
                },
              }}
            />
          </div>
        </Card>

      </div>

      <div className="flex justify-end">
        <Button size="lg" className="bg-gradient-knowledge shadow-glow" onClick={() => navigate("/subjects")}>Iniciar Exercício</Button>
      </div>
    </div>
  );
};

export default Dashboard;