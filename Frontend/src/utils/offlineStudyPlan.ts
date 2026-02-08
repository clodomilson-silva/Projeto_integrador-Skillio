/**
 * Gerador de plano de estudo offline
 * Usado quando não há conexão com a internet
 */

type AnaliseArea = {
  acertos: number;
  erros: number;
  pulos: number;
};

type Analise = Record<string, AnaliseArea>;

export type StudyPlanAction = {
  title: string;
  description: string;
  priority: string;
};

export type StudyPlan = {
  title: string;
  greeting: string;
  analysis: {
    summary: string;
    focusPoints: string[];
    strength: string;
  };
  actionPlan: StudyPlanAction[];
  nextChallenge: {
    title: string;
    suggestion: string;
  };
  motivation: string;
};

/**
 * Gera um plano de estudo personalizado offline baseado nos resultados do quiz
 * @param analise - Análise de desempenho por área
 * @param maxStreak - Maior sequência de acertos
 * @param maxErrorStreak - Maior sequência de erros
 * @param userName - Nome do usuário
 * @returns Plano de estudo completo
 */
export function gerarPlanoEstudoOffline(
  analise: Analise,
  maxStreak: number = 0,
  maxErrorStreak: number = 0,
  userName: string = "Estudante"
): StudyPlan {
  // Calcula totais
  const areas = Object.entries(analise);
  let totalAcertos = 0;
  let totalQuestoes = 0;

  areas.forEach(([_, data]) => {
    totalAcertos += data.acertos;
    totalQuestoes += data.acertos + data.erros + data.pulos;
  });

  const percentualGeral = totalQuestoes > 0 ? (totalAcertos / totalQuestoes) * 100 : 0;

  // Identifica pontos fortes e fracos
  const areasOrdenadas = areas.map(([area, data]) => {
    const total = data.acertos + data.erros + data.pulos;
    const percentual = total > 0 ? (data.acertos / total) * 100 : 0;
    return {
      area,
      acertos: data.acertos,
      erros: data.erros,
      pulos: data.pulos,
      total,
      percentual
    };
  }).sort((a, b) => a.percentual - b.percentual);

  const areasMaisFracas = areasOrdenadas.slice(0, 3);
  const areasFortes = areasOrdenadas.slice(-3).reverse();
  const pontoForte = areasFortes[0]?.area || "Dedicação";

  // Gera saudação personalizada
  let greeting = `Olá, ${userName}! `;
  if (percentualGeral >= 80) {
    greeting += "Parabéns pelo excelente desempenho! 🌟";
  } else if (percentualGeral >= 60) {
    greeting += "Bom trabalho! Você está no caminho certo! 👏";
  } else if (percentualGeral >= 40) {
    greeting += "Há espaço para crescer, e estou aqui para ajudar! 💪";
  } else {
    greeting += "Vamos juntos melhorar seu desempenho! 🚀";
  }

  // Análise resumida
  const summary = `Você acertou ${totalAcertos} de ${totalQuestoes} questões (${percentualGeral.toFixed(1)}%). ` +
    (maxStreak > 3 
      ? `Sua maior sequência de acertos foi ${maxStreak}, mostrando ótima consistência! ` 
      : `Continue praticando para aumentar sua sequência de acertos. `) +
    (maxErrorStreak > 3
      ? `Observe que houve uma sequência de ${maxErrorStreak} erros - isso indica áreas que precisam de atenção especial.`
      : `Seu desempenho foi consistente ao longo do quiz.`);

  // Pontos de foco
  const focusPoints = areasMaisFracas.map(area => {
    const percentual = area.percentual.toFixed(0);
    if (area.percentual < 30) {
      return `${area.area}: Requer atenção urgente (${percentual}% de acertos). Dedique mais tempo a esta matéria.`;
    } else if (area.percentual < 50) {
      return `${area.area}: Precisa de reforço (${percentual}% de acertos). Pratique exercícios básicos.`;
    } else {
      return `${area.area}: Quase lá (${percentual}% de acertos). Revise os conceitos principais.`;
    }
  });

  // Plano de ação detalhado
  const actionPlan: StudyPlanAction[] = [];

  // Ação 1: Área mais fraca
  if (areasMaisFracas[0]) {
    const area = areasMaisFracas[0];
    actionPlan.push({
      title: `Prioridade Máxima: ${area.area}`,
      description: area.percentual < 30
        ? `Com apenas ${area.percentual.toFixed(0)}% de acertos, esta é sua prioridade número 1. Comece pelos conceitos básicos, assista videoaulas introdutórias e faça exercícios simples diariamente.`
        : `Dedique 30-45 minutos diários para revisar os conceitos fundamentais. Use recursos visuais, mapas mentais e pratique com exercícios progressivos.`,
      priority: "ALTA"
    });
  }

  // Ação 2: Segunda área mais fraca
  if (areasMaisFracas[1]) {
    const area = areasMaisFracas[1];
    actionPlan.push({
      title: `Reforço em ${area.area}`,
      description: `Com ${area.percentual.toFixed(0)}% de acertos, reserve 20-30 minutos diários para esta matéria. Foque nos tópicos onde errou mais e faça listas de exercícios.`,
      priority: "MÉDIA"
    });
  }

  // Ação 3: Terceira área ou hábitos de estudo
  if (areasMaisFracas[2]) {
    const area = areasMaisFracas[2];
    actionPlan.push({
      title: `Aprimoramento em ${area.area}`,
      description: `Você já tem uma base (${area.percentual.toFixed(0)}% de acertos). Pratique questões intermediárias e busque compreender os erros. Dedique 15-20 minutos diários.`,
      priority: "MÉDIA"
    });
  }

  // Ação 4: Organização e consistência
  actionPlan.push({
    title: maxStreak > 5 ? "Mantenha a Consistência" : "Desenvolva Consistência",
    description: maxStreak > 5
      ? `Sua sequência de ${maxStreak} acertos mostra que você sabe se concentrar. Continue com sessões de estudo regulares de 25-30 minutos com pausas de 5 minutos (técnica Pomodoro).`
      : `Estabeleça uma rotina de estudos: 25 minutos de foco + 5 minutos de pausa. Comece com metas pequenas e aumente gradualmente. A consistência é mais importante que a quantidade.`,
    priority: "MÉDIA"
  });

  // Ação 5: Revisão dos pontos fortes
  if (areasFortes[0] && areasFortes[0].percentual > 60) {
    actionPlan.push({
      title: `Mantenha seu ponto forte: ${pontoForte}`,
      description: `Você se destaca em ${pontoForte} com ${areasFortes[0].percentual.toFixed(0)}% de acertos. Continue praticando para não perder o ritmo, mas foque mais nas áreas que precisam de atenção.`,
      priority: "BAIXA"
    });
  }

  // Próximo desafio
  const nextChallenge = {
    title: percentualGeral < 50 
      ? "Objetivo: Alcançar 50% de acertos gerais" 
      : percentualGeral < 70
        ? "Objetivo: Alcançar 70% de acertos gerais"
        : "Objetivo: Alcançar 85%+ de acertos",
    suggestion: percentualGeral < 50
      ? "Comece revisando os conceitos básicos das 3 áreas mais fracas. Dedique pelo menos 1 hora por dia ao estudo focado. Em 2 semanas, refaça o quiz e veja seu progresso!"
      : percentualGeral < 70
        ? "Foque nas áreas com menos de 60% de acertos. Alterne entre teoria e prática. Em 10 dias, refaça o quiz para medir sua evolução!"
        : "Você está indo muito bem! Agora foque em dominar completamente as áreas onde ainda tem dúvidas. Aprofunde-se em questões avançadas e desafiadoras!"
  };

  // Mensagem motivacional personalizada
  let motivation = "";
  if (percentualGeral >= 80) {
    motivation = "Você é capaz de coisas incríveis! Continue assim e logo alcançará a excelência. Cada acerto é um passo em direção ao seu objetivo. Acredite no seu potencial! 🌟";
  } else if (percentualGeral >= 60) {
    motivation = "Seu progresso é real e valioso! Não desanime com os erros - eles são oportunidades de aprendizado. Continue estudando com dedicação e você verá os resultados! 💪";
  } else if (percentualGeral >= 40) {
    motivation = "Começar é o primeiro passo, e você já o deu! Cada dia de estudo te aproxima dos seus objetivos. Não compare seu progresso com o de outros - foque em ser melhor que você foi ontem. Você consegue! 🚀";
  } else {
    motivation = "Todo especialista já foi um iniciante. O importante é não desistir! Pequenos progressos diários levam a grandes conquistas. Acredite em você e siga em frente, um passo de cada vez. Você é capaz! 💫";
  }

  // Adiciona mensagem sobre modo offline se aplicável
  const isOffline = !navigator.onLine;
  if (isOffline) {
    motivation += "\n\nNota: Este plano foi gerado localmente devido à falta de conexão. Quando a internet estiver disponível, você poderá gerar um plano ainda mais personalizado com IA!";
  }

  return {
    title: percentualGeral >= 70 
      ? "Plano de Aprimoramento" 
      : percentualGeral >= 50
        ? "Plano de Desenvolvimento"
        : "Plano de Recuperação e Crescimento",
    greeting,
    analysis: {
      summary,
      focusPoints,
      strength: areasFortes[0] 
        ? `Seu ponto forte é ${pontoForte} (${areasFortes[0].percentual.toFixed(0)}% de acertos). Use isso como motivação!`
        : "Continue praticando para descobrir seus pontos fortes!"
    },
    actionPlan,
    nextChallenge,
    motivation
  };
}

/**
 * Salva o plano de estudo no localStorage
 * @param plan - Plano de estudo a ser salvo
 */
export function salvarPlanoLocal(plan: StudyPlan): void {
  try {
    localStorage.setItem('offlineStudyPlan', JSON.stringify(plan));
    localStorage.setItem('offlineStudyPlanDate', new Date().toISOString());
    console.log('✅ Plano de estudo salvo localmente');
  } catch (error) {
    console.error('❌ Erro ao salvar plano local:', error);
  }
}

/**
 * Recupera o plano de estudo do localStorage
 * @returns Plano de estudo salvo ou null
 */
export function recuperarPlanoLocal(): StudyPlan | null {
  try {
    const planString = localStorage.getItem('offlineStudyPlan');
    if (planString) {
      return JSON.parse(planString);
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao recuperar plano local:', error);
    return null;
  }
}
