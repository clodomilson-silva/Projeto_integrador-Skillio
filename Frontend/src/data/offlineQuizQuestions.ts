/**
 * Banco de perguntas offline para o Quiz de Nivelamento
 * Usado como fallback quando não há conexão com a internet
 */

export type PerguntaQuiz = {
  pergunta: string;
  alternativas: string[];
  resposta: number;
  area: string;
};

/**
 * Perguntas organizadas por nível de dificuldade e matéria
 * Total: 75 perguntas para garantir variedade
 */
export const offlineQuizQuestions: PerguntaQuiz[] = [
  // ====== MATEMÁTICA (12 perguntas) ======
  {
    pergunta: 'Quanto é 7 multiplicado por 8?',
    alternativas: ['49', '54', '56', '63'],
    resposta: 2,
    area: 'Matemática'
  },
  {
    pergunta: 'Qual o resultado de 10 - (2 + 3)?',
    alternativas: ['5', '6', '7', '8'],
    resposta: 0,
    area: 'Matemática'
  },
  {
    pergunta: 'Se um círculo tem um raio de 5 cm, qual o seu diâmetro?',
    alternativas: ['5 cm', '10 cm', '15 cm', '25 cm'],
    resposta: 1,
    area: 'Matemática'
  },
  {
    pergunta: 'Qual é a raiz quadrada de 144?',
    alternativas: ['10', '11', '12', '13'],
    resposta: 2,
    area: 'Matemática'
  },
  {
    pergunta: 'Se x + 5 = 12, quanto vale x?',
    alternativas: ['5', '6', '7', '17'],
    resposta: 2,
    area: 'Matemática'
  },
  {
    pergunta: 'Quanto é 15% de 200?',
    alternativas: ['20', '25', '30', '35'],
    resposta: 2,
    area: 'Matemática'
  },
  {
    pergunta: 'Qual o perímetro de um quadrado com lado de 4 cm?',
    alternativas: ['8 cm', '12 cm', '16 cm', '20 cm'],
    resposta: 2,
    area: 'Matemática'
  },
  {
    pergunta: 'Se um produto custa R$ 80 e teve um desconto de 25%, qual o valor final?',
    alternativas: ['R$ 55', 'R$ 60', 'R$ 65', 'R$ 70'],
    resposta: 1,
    area: 'Matemática'
  },
  {
    pergunta: 'Quanto é 2³ (2 elevado a 3)?',
    alternativas: ['6', '8', '9', '12'],
    resposta: 1,
    area: 'Matemática'
  },
  {
    pergunta: 'Qual o valor de π (pi) aproximadamente?',
    alternativas: ['2.14', '3.14', '4.14', '5.14'],
    resposta: 1,
    area: 'Matemática'
  },
  {
    pergunta: 'Uma dúzia tem quantas unidades?',
    alternativas: ['10', '11', '12', '13'],
    resposta: 2,
    area: 'Matemática'
  },
  {
    pergunta: 'Qual a fração equivalente a 50%?',
    alternativas: ['1/4', '1/3', '1/2', '2/3'],
    resposta: 2,
    area: 'Matemática'
  },

  // ====== PORTUGUÊS (12 perguntas) ======
  {
    pergunta: 'Qual o sinônimo de "rápido"?',
    alternativas: ['Lento', 'Veloz', 'Grande', 'Pequeno'],
    resposta: 1,
    area: 'Português'
  },
  {
    pergunta: 'Qual o coletivo de "cães"?',
    alternativas: ['Alcateia', 'Manada', 'Matilha', 'Cardume'],
    resposta: 2,
    area: 'Português'
  },
  {
    pergunta: 'Qual a classe gramatical da palavra "bonito"?',
    alternativas: ['Substantivo', 'Verbo', 'Adjetivo', 'Advérbio'],
    resposta: 2,
    area: 'Português'
  },
  {
    pergunta: 'Qual é o plural de "cidadão"?',
    alternativas: ['Cidadãos', 'Cidadães', 'Cidadões', 'Cidadães'],
    resposta: 0,
    area: 'Português'
  },
  {
    pergunta: 'Em "João comprou um livro", qual é o sujeito da frase?',
    alternativas: ['comprou', 'um livro', 'João', 'livro'],
    resposta: 2,
    area: 'Português'
  },
  {
    pergunta: 'Qual alternativa apresenta um oxítona?',
    alternativas: ['Café', 'Árvore', 'Música', 'Pássaro'],
    resposta: 0,
    area: 'Português'
  },
  {
    pergunta: 'Qual o antônimo de "alegre"?',
    alternativas: ['Feliz', 'Contente', 'Triste', 'Animado'],
    resposta: 2,
    area: 'Português'
  },
  {
    pergunta: 'Qual frase está correta?',
    alternativas: ['Eu vi ela ontem', 'Eu a vi ontem', 'Eu viu ela ontem', 'Eu vimos ela ontem'],
    resposta: 1,
    area: 'Português'
  },
  {
    pergunta: 'O que é uma metáfora?',
    alternativas: ['Uma comparação direta', 'Uma comparação indireta', 'Uma pergunta retórica', 'Uma negação'],
    resposta: 1,
    area: 'Português'
  },
  {
    pergunta: 'Quantas sílabas tem a palavra "computador"?',
    alternativas: ['3', '4', '5', '6'],
    resposta: 2,
    area: 'Português'
  },
  {
    pergunta: 'Qual é o diminutivo de "casa"?',
    alternativas: ['Casinha', 'Casão', 'Casarão', 'Casona'],
    resposta: 0,
    area: 'Português'
  },
  {
    pergunta: 'Em que tempo verbal está: "Eu estudava todos os dias"?',
    alternativas: ['Presente', 'Pretérito perfeito', 'Pretérito imperfeito', 'Futuro'],
    resposta: 2,
    area: 'Português'
  },

  // ====== HISTÓRIA (10 perguntas) ======
  {
    pergunta: 'Quem descobriu o Brasil?',
    alternativas: ['Cristóvão Colombo', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Fernando de Magalhães'],
    resposta: 1,
    area: 'História'
  },
  {
    pergunta: 'Em que ano o Brasil se tornou independente?',
    alternativas: ['1500', '1822', '1889', '1922'],
    resposta: 1,
    area: 'História'
  },
  {
    pergunta: 'Quem foi o primeiro presidente do Brasil?',
    alternativas: ['Dom Pedro I', 'Dom Pedro II', 'Marechal Deodoro da Fonseca', 'Getúlio Vargas'],
    resposta: 2,
    area: 'História'
  },
  {
    pergunta: 'Em que ano começou a Segunda Guerra Mundial?',
    alternativas: ['1914', '1939', '1945', '1929'],
    resposta: 1,
    area: 'História'
  },
  {
    pergunta: 'Qual civilização construiu as pirâmides de Gizé?',
    alternativas: ['Romana', 'Grega', 'Egípcia', 'Maia'],
    resposta: 2,
    area: 'História'
  },
  {
    pergunta: 'Quem pintou a Mona Lisa?',
    alternativas: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'],
    resposta: 1,
    area: 'História'
  },
  {
    pergunta: 'A Revolução Industrial começou em qual país?',
    alternativas: ['França', 'Alemanha', 'Inglaterra', 'Estados Unidos'],
    resposta: 2,
    area: 'História'
  },
  {
    pergunta: 'Quem foi o líder da Alemanha Nazi?',
    alternativas: ['Mussolini', 'Stalin', 'Hitler', 'Churchill'],
    resposta: 2,
    area: 'História'
  },
  {
    pergunta: 'Em que século ocorreu a Proclamação da República no Brasil?',
    alternativas: ['Século XVII', 'Século XVIII', 'Século XIX', 'Século XX'],
    resposta: 2,
    area: 'História'
  },
  {
    pergunta: 'Qual evento marcou o início da Idade Média?',
    alternativas: ['Queda de Roma', 'Descoberta da América', 'Reforma Protestante', 'Revolução Francesa'],
    resposta: 0,
    area: 'História'
  },

  // ====== GEOGRAFIA (10 perguntas) ======
  {
    pergunta: 'Qual a capital do Brasil?',
    alternativas: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
    resposta: 2,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual o maior continente do mundo?',
    alternativas: ['África', 'Europa', 'Ásia', 'América'],
    resposta: 2,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual o rio mais longo do mundo?',
    alternativas: ['Nilo', 'Amazonas', 'Yangtzé', 'Mississipi'],
    resposta: 1,
    area: 'Geografia'
  },
  {
    pergunta: 'Quantos estados tem o Brasil?',
    alternativas: ['25', '26', '27', '28'],
    resposta: 2,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual o maior oceano do planeta?',
    alternativas: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'],
    resposta: 2,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual país tem a maior população do mundo?',
    alternativas: ['Índia', 'China', 'Estados Unidos', 'Brasil'],
    resposta: 0,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual a capital da França?',
    alternativas: ['Londres', 'Berlim', 'Madri', 'Paris'],
    resposta: 3,
    area: 'Geografia'
  },
  {
    pergunta: 'Em qual continente fica o Egito?',
    alternativas: ['Ásia', 'África', 'Europa', 'Oriente Médio'],
    resposta: 1,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual a montanha mais alta do mundo?',
    alternativas: ['K2', 'Monte Everest', 'Kilimanjaro', 'Mont Blanc'],
    resposta: 1,
    area: 'Geografia'
  },
  {
    pergunta: 'Qual estado brasileiro é famoso pelo Pantanal?',
    alternativas: ['Amazonas', 'Pará', 'Mato Grosso do Sul', 'Acre'],
    resposta: 2,
    area: 'Geografia'
  },

  // ====== BIOLOGIA (8 perguntas) ======
  {
    pergunta: 'Qual animal é conhecido como o "rei da selva"?',
    alternativas: ['Tigre', 'Leão', 'Elefante', 'Urso'],
    resposta: 1,
    area: 'Biologia'
  },
  {
    pergunta: 'Qual a fórmula da água?',
    alternativas: ['CO2', 'H2O', 'O2', 'N2'],
    resposta: 1,
    area: 'Biologia'
  },
  {
    pergunta: 'Qual processo as plantas usam para converter luz em energia?',
    alternativas: ['Respiração', 'Fotossíntese', 'Transpiração', 'Digestão'],
    resposta: 1,
    area: 'Biologia'
  },
  {
    pergunta: 'Quantos ossos tem o corpo humano adulto?',
    alternativas: ['186', '206', '226', '246'],
    resposta: 1,
    area: 'Biologia'
  },
  {
    pergunta: 'Qual o maior órgão do corpo humano?',
    alternativas: ['Fígado', 'Coração', 'Pele', 'Cérebro'],
    resposta: 2,
    area: 'Biologia'
  },
  {
    pergunta: 'Qual gás as plantas liberam durante a fotossíntese?',
    alternativas: ['Nitrogênio', 'Oxigênio', 'Gás carbônico', 'Hidrogênio'],
    resposta: 1,
    area: 'Biologia'
  },
  {
    pergunta: 'Qual animal é considerado o mais rápido do mundo?',
    alternativas: ['Leão', 'Guepardo', 'Leopardo', 'Tigre'],
    resposta: 1,
    area: 'Biologia'
  },
  {
    pergunta: 'Quantas câmaras tem o coração humano?',
    alternativas: ['2', '3', '4', '5'],
    resposta: 2,
    area: 'Biologia'
  },

  // ====== FÍSICA (6 perguntas) ======
  {
    pergunta: 'Qual a velocidade da luz no vácuo?',
    alternativas: ['300.000 km/s', '150.000 km/s', '450.000 km/s', '100.000 km/s'],
    resposta: 0,
    area: 'Física'
  },
  {
    pergunta: 'Qual a unidade de medida da força?',
    alternativas: ['Joule', 'Newton', 'Watt', 'Pascal'],
    resposta: 1,
    area: 'Física'
  },
  {
    pergunta: 'O que é a gravidade?',
    alternativas: ['Uma força que atrai objetos', 'Uma forma de energia', 'Um tipo de onda', 'Uma partícula'],
    resposta: 0,
    area: 'Física'
  },
  {
    pergunta: 'Qual cientista formulou as leis do movimento?',
    alternativas: ['Einstein', 'Newton', 'Galileu', 'Kepler'],
    resposta: 1,
    area: 'Física'
  },
  {
    pergunta: 'O que acontece com a água a 100°C ao nível do mar?',
    alternativas: ['Congela', 'Ferve', 'Evapora lentamente', 'Nada'],
    resposta: 1,
    area: 'Física'
  },
  {
    pergunta: 'Qual o símbolo da energia?',
    alternativas: ['E', 'F', 'P', 'W'],
    resposta: 0,
    area: 'Física'
  },

  // ====== QUÍMICA (5 perguntas) ======
  {
    pergunta: 'Qual o símbolo químico do ouro?',
    alternativas: ['O', 'Au', 'Ag', 'Go'],
    resposta: 1,
    area: 'Química'
  },
  {
    pergunta: 'Qual o pH da água pura?',
    alternativas: ['5', '7', '9', '11'],
    resposta: 1,
    area: 'Química'
  },
  {
    pergunta: 'O que é a tabela periódica?',
    alternativas: ['Uma lista de doenças', 'Uma organização dos elementos químicos', 'Um calendário', 'Uma lista de planetas'],
    resposta: 1,
    area: 'Química'
  },
  {
    pergunta: 'Qual gás é mais abundante na atmosfera?',
    alternativas: ['Oxigênio', 'Nitrogênio', 'Gás carbônico', 'Hidrogênio'],
    resposta: 1,
    area: 'Química'
  },
  {
    pergunta: 'O que acontece em uma reação de combustão?',
    alternativas: ['Congelamento', 'Queima com liberação de energia', 'Evaporação', 'Cristalização'],
    resposta: 1,
    area: 'Química'
  },

  // ====== INGLÊS (6 perguntas) ======
  {
    pergunta: 'Qual a tradução de "book" para o português?',
    alternativas: ['Livro', 'Caneta', 'Mesa', 'Cadeira'],
    resposta: 0,
    area: 'Inglês'
  },
  {
    pergunta: 'Como se diz "obrigado" em inglês?',
    alternativas: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
    resposta: 2,
    area: 'Inglês'
  },
  {
    pergunta: 'O que significa "cat" em inglês?',
    alternativas: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'],
    resposta: 1,
    area: 'Inglês'
  },
  {
    pergunta: 'Como se diz "bom dia" em inglês?',
    alternativas: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
    resposta: 1,
    area: 'Inglês'
  },
  {
    pergunta: 'Qual o plural de "child"?',
    alternativas: ['Childs', 'Children', 'Childes', 'Childrens'],
    resposta: 1,
    area: 'Inglês'
  },
  {
    pergunta: 'O que significa "apple"?',
    alternativas: ['Laranja', 'Banana', 'Maçã', 'Uva'],
    resposta: 2,
    area: 'Inglês'
  },

  // ====== LÓGICA (6 perguntas) ======
  {
    pergunta: 'Se um trem viaja a 100 km/h, que distância ele percorre em 2 horas?',
    alternativas: ['100 km', '150 km', '200 km', '250 km'],
    resposta: 2,
    area: 'Lógica'
  },
  {
    pergunta: 'Qual o próximo número na sequência: 2, 4, 6, 8, ...?',
    alternativas: ['9', '10', '11', '12'],
    resposta: 1,
    area: 'Lógica'
  },
  {
    pergunta: 'Se todo A é B e todo B é C, então:',
    alternativas: ['Todo C é A', 'Nenhum A é C', 'Todo A é C', 'Algum A não é C'],
    resposta: 2,
    area: 'Lógica'
  },
  {
    pergunta: 'Um pai tem o dobro da idade do filho. Juntos, eles têm 60 anos. Qual a idade do pai?',
    alternativas: ['30', '40', '45', '50'],
    resposta: 1,
    area: 'Lógica'
  },
  {
    pergunta: 'Complete a sequência: A, C, E, G, ...?',
    alternativas: ['H', 'I', 'J', 'K'],
    resposta: 1,
    area: 'Lógica'
  },
  {
    pergunta: 'Se 3 gatos pegam 3 ratos em 3 minutos, quantos gatos são necessários para pegar 100 ratos em 100 minutos?',
    alternativas: ['3', '30', '33', '100'],
    resposta: 0,
    area: 'Lógica'
  },

  // ====== INFORMÁTICA (6 perguntas) ======
  {
    pergunta: 'O que significa a sigla "CPU" em um computador?',
    alternativas: ['Unidade Central de Processamento', 'Placa de Vídeo', 'Memória RAM', 'Fonte de Energia'],
    resposta: 0,
    area: 'Informática'
  },
  {
    pergunta: 'Qual empresa desenvolveu o sistema operacional Windows?',
    alternativas: ['Apple', 'Google', 'Microsoft', 'Linux'],
    resposta: 2,
    area: 'Informática'
  },
  {
    pergunta: 'O que é um "phishing"?',
    alternativas: ['Um tipo de vírus', 'Um ataque para roubar informações', 'Uma peça de hardware', 'Um software de edição'],
    resposta: 1,
    area: 'Informática'
  },
  {
    pergunta: 'Qual a função da memória RAM?',
    alternativas: ['Armazenar dados permanentemente', 'Processar dados', 'Armazenar dados temporariamente', 'Conectar à internet'],
    resposta: 2,
    area: 'Informática'
  },
  {
    pergunta: 'O que significa WWW?',
    alternativas: ['World Wide Web', 'World Web Wide', 'Web World Wide', 'Wide World Web'],
    resposta: 0,
    area: 'Informática'
  },
  {
    pergunta: 'Qual a unidade básica de informação em computação?',
    alternativas: ['Byte', 'Bit', 'Megabyte', 'Gigabyte'],
    resposta: 1,
    area: 'Informática'
  },

  // ====== PROGRAMAÇÃO (6 perguntas) ======
  {
    pergunta: 'Qual linguagem é conhecida como a "linguagem da web"?',
    alternativas: ['Python', 'Java', 'JavaScript', 'C++'],
    resposta: 2,
    area: 'Programação'
  },
  {
    pergunta: 'O que significa HTML?',
    alternativas: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
    resposta: 0,
    area: 'Programação'
  },
  {
    pergunta: 'Qual estrutura de dados funciona como "primeiro a entrar, primeiro a sair"?',
    alternativas: ['Pilha', 'Fila', 'Árvore', 'Grafo'],
    resposta: 1,
    area: 'Programação'
  },
  {
    pergunta: 'O que é um loop em programação?',
    alternativas: ['Um erro', 'Uma repetição de código', 'Uma variável', 'Uma função'],
    resposta: 1,
    area: 'Programação'
  },
  {
    pergunta: 'Qual símbolo é usado para comentários em Python?',
    alternativas: ['//', '/*', '#', '<!--'],
    resposta: 2,
    area: 'Programação'
  },
  {
    pergunta: 'O que significa "bug" em programação?',
    alternativas: ['Um recurso', 'Um erro no código', 'Um tipo de variável', 'Uma linguagem'],
    resposta: 1,
    area: 'Programação'
  }
];

/**
 * Gera um quiz personalizado de 25 perguntas com base no foco do usuário
 * @param foco - Área de foco do usuário
 * @returns Array com 25 perguntas
 */
export function gerarQuizOffline(foco: string): PerguntaQuiz[] {
  // Normaliza o foco para comparação
  const focoNormalizado = foco.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Separa perguntas por categoria
  const perguntasPorArea: { [key: string]: PerguntaQuiz[] } = {};
  offlineQuizQuestions.forEach(pergunta => {
    if (!perguntasPorArea[pergunta.area]) {
      perguntasPorArea[pergunta.area] = [];
    }
    perguntasPorArea[pergunta.area].push(pergunta);
  });

  // Embaralha array
  const shuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Tenta encontrar perguntas da área de foco
  let perguntasFoco: PerguntaQuiz[] = [];
  const areaCorrespondente = Object.keys(perguntasPorArea).find(area => 
    area.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(focoNormalizado) ||
    focoNormalizado.includes(area.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  if (areaCorrespondente) {
    perguntasFoco = shuffle(perguntasPorArea[areaCorrespondente]).slice(0, 12);
  }

  // Pega 13 perguntas variadas de outras áreas
  const outrasPerguntas: PerguntaQuiz[] = [];
  Object.entries(perguntasPorArea).forEach(([area, perguntas]) => {
    if (area !== areaCorrespondente) {
      outrasPerguntas.push(...perguntas);
    }
  });

  const perguntasVariadas = shuffle(outrasPerguntas).slice(0, 13);

  // Combina e embaralha todas as 25 perguntas
  const quizCompleto = shuffle([...perguntasFoco, ...perguntasVariadas]).slice(0, 25);

  console.log('📚 Quiz offline gerado:', {
    foco,
    total: quizCompleto.length,
    distribuicao: quizCompleto.reduce((acc, p) => {
      acc[p.area] = (acc[p.area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

  return quizCompleto;
}
