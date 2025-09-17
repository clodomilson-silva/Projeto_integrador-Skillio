import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Tipo seguro para perguntas do quiz
type PerguntaQuiz = {
  pergunta: string;
  alternativas: string[];
  resposta: number;
  area: string;
};

// Integração Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_LANGUAGE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

async function gerarPerguntasGemini(escolaridade: string): Promise<PerguntaQuiz[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Gere 20 perguntas de múltipla escolha para um quiz de nivelamento para um estudante com nível de escolaridade "${escolaridade}", abrangendo as seguintes áreas: conhecimentos gerais, matemática, português, geografia, história, inglês e lógica. Para cada pergunta, retorne no formato JSON:
    {
      "pergunta": "texto da pergunta",
      "alternativas": ["alternativa1", "alternativa2", "alternativa3", "alternativa4"],
      "resposta": índice da alternativa correta (0 a 3),
      "area": "área do conhecimento"
    }
    Retorne um array JSON apenas, sem explicações.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Tenta extrair JSON do texto retornado
    try {
        const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          return JSON.parse(jsonMatch[1]);
        } else {
          // Tenta fazer o parse do texto diretamente se não houver markdown
          return JSON.parse(text);
        }
    } catch(e) {
        console.error("Erro ao fazer parse do JSON da resposta da IA:", e);
        console.error("Resposta recebida:", text);
        return [];
    }

  } catch (e) {
    console.error("Erro ao gerar perguntas com a IA:", e);
    return [];
  }
}

const QuizNivelamento = () => {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [perguntasNivelamento, setPerguntasNivelamento] = useState<PerguntaQuiz[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const escolaridadeValue = localStorage.getItem('userEducationalLevel') || 'medio';
      const escolaridadeMap: { [key: string]: string } = {
          basico: 'Nível Básico',
          fundamental: 'Ensino Fundamental',
          medio: 'Ensino Médio'
      };
      const escolaridadePrompt = escolaridadeMap[escolaridadeValue] || 'Ensino Médio';

      setCarregando(true);
      setErro(null);
      const perguntas = await gerarPerguntasGemini(escolaridadePrompt);
      if (perguntas.length > 0) {
        setPerguntasNivelamento(perguntas);
      } else {
        setErro("Não foi possível gerar as perguntas com a IA. Verifique sua chave de API e a conexão. Usando perguntas de exemplo.");
        setPerguntasNivelamento([
          {
            pergunta: "Qual é a capital do Brasil?",
            alternativas: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
            resposta: 2,
            area: "Geografia"
          },
          {
            pergunta: "Qual é o tempo verbal passado de 'read'?",
            alternativas: ["read", "red", "readed", "reading"],
            resposta: 0,
            area: "Inglês"
          },
          {
            pergunta: "Qual o resultado de 5 + 3 * 2?",
            alternativas: ["16", "11", "13", "10"],
            resposta: 1,
            area: "Matemática"
          }
        ]);
      }
      setCarregando(false);
    })();
  }, []);

  const perguntaAtual = perguntasNivelamento[indice];

  const handleResponder = (i: number) => {
    setRespostas([...respostas, i]);
    if (indice < perguntasNivelamento.length - 1) {
      setIndice(indice + 1);
    } else {
      setFinalizado(true);
    }
  };

  // Análise simples de acertos/erros por área
  const planoEstudo = () => {
    const analise: Record<string, { acertos: number; erros: number }> = {};
    perguntasNivelamento.forEach((q, idx) => {
      if (!analise[q.area]) analise[q.area] = { acertos: 0, erros: 0 };
      if (respostas[idx] === q.resposta) analise[q.area].acertos++;
      else analise[q.area].erros++;
    });
    return analise;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="p-8 max-w-lg w-full shadow-elevated">
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {erro}</span>
          </div>
        )}
        {carregando ? (
          <div className="text-center py-12">
            <span className="text-lg font-semibold">Gerando perguntas por IA...</span>
          </div>
        ) : !finalizado ? (
          <>
            <div className="mb-4">
              <span className="text-sm font-medium">Pergunta {indice + 1} de {perguntasNivelamento.length}</span>
              <Progress value={((indice + 1) / perguntasNivelamento.length) * 100} className="h-2 mt-2" />
            </div>
            <h2 className="text-xl font-bold mb-6">{perguntaAtual.pergunta}</h2>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {perguntaAtual.alternativas.map((alt, i) => (
                <Button key={i} variant="outline" className="h-12" onClick={() => handleResponder(i)}>{String.fromCharCode(65 + i)}) {alt}</Button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz de Nivelamento Finalizado!</h2>
            <p className="mb-4 text-muted-foreground">Veja seu plano de estudo sugerido com base nos seus acertos e erros:</p>
            <div className="mb-6">
              {Object.entries(planoEstudo()).map(([area, dados], i) => (
                <div key={i} className="mb-2">
                  <span className="font-semibold">{area}:</span> <span className="text-success">{dados.acertos} acertos</span> / <span className="text-danger">{dados.erros} erros</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="bg-gradient-growth" onClick={() => navigate("/Dashboard")}>Ir para Dashboard</Button>
          </div>
        )}
      </Card>
    </div>
  );

};

export default QuizNivelamento;
