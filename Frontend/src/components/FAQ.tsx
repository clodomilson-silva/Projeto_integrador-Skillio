import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Como criar uma conta?",
    answer: "Clique em 'Registrar' na página inicial e preencha seus dados para criar uma conta gratuita.",
  },
  {
    question: "Como funciona o ranking de jogadores?",
    answer: "O ranking é baseado na quantidade de XP acumulada por cada jogador. Quanto mais você joga e aprende, mais XP ganha!",
  },
  {
    question: "Como funciona a trilha de aprendizado personalizada?",
    answer: "A trilha é montada automaticamente com base no seu desempenho, sugerindo conteúdos e desafios para acelerar seu aprendizado.",
  },
  {
    question: "O que é XP e como posso ganhar mais pontos?",
    answer: "XP são pontos de experiência. Você ganha XP ao completar quizzes, missões, trilhas e ao participar de atividades na plataforma.",
  },
  {
    question: "Como posso acessar o painel de estatísticas?",
    answer: "Após fazer login, clique em 'Dashboard' no menu para visualizar seu progresso, conquistas e desempenho por matéria.",
  },
  {
    question: "Preciso pagar para usar o Skillio?",
    answer: "Não. O Skillio é gratuito para estudantes. Algumas funcionalidades premium podem ser lançadas futuramente, mas o acesso principal é livre.",
  },
  {
    question: "Como posso recuperar minha senha?",
    answer: "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções para redefinir.",
  },
  {
    question: "Como posso alterar minha foto de perfil?",
    answer: "Acesse seu perfil, clique em 'Editar Perfil' e envie uma nova imagem. O sistema aceita arquivos JPG, PNG e GIF.",
  },
  {
    question: "Como posso instalar o Skillio como aplicativo?",
    answer: "No navegador, clique em 'Instalar' ou use o menu para adicionar à tela inicial. O app funcionará como um aplicativo nativo.",
  },
  {
    question: "Como funciona o sistema de missões e conquistas?",
    answer: "Missões são desafios diários ou semanais. Ao completar, você ganha XP. Conquistas são marcos importantes do seu progresso.",
  },
  {
    question: "Como posso sugerir melhorias ou reportar bugs?",
    answer: "Acesse a página de Suporte e envie sua sugestão ou relato. Nossa equipe responde rapidamente!",
  },
  {
    question: "Quais navegadores são suportados?",
    answer: "Skillio funciona nos principais navegadores modernos: Chrome, Edge, Firefox, Opera e Safari.",
  },
  {
    question: "Como funciona a integração com o Google reCAPTCHA?",
    answer: "O reCAPTCHA protege o sistema contra bots e abusos. Você verá desafios de segurança apenas em situações suspeitas.",
  },
  {
    question: "Como posso excluir minha conta?",
    answer: "Acesse seu 'perfil' e depois 'editar perfil', você verá um botão 'apagar conta', lembrando que esta ação é irreversível.",
  },
  
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto my-8 p-4 bg-background rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">FAQ - Perguntas Frequentes</h2>
      <ul className="space-y-4">
        {faqData.map((item, idx) => (
          <li key={idx} className="border rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 bg-primary/10 hover:bg-primary/20 font-semibold text-lg focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {item.question}
            </button>
            {openIndex === idx && (
              <div className="px-4 py-3 bg-background text-muted-foreground border-t">
                {item.answer}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}



