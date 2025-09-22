export interface Bloco {
  id: string;          // Ex: "nivel-1-foco-1"
  tipo: 'foco' | 'bncc'; // Para diferenciar as perguntas
  titulo: string;      // Ex: "Foco 1" ou "Revisão BNCC 1"
}

export interface NivelTrilha {
  nivel: number;       // O número do nível (1 a 30)
  titulo: string;      // Ex: "Nível 1: Primeiros Passos"
  blocos: Bloco[];     // A lista de 15 blocos
}

export function gerarTrilhaPrincipal(): NivelTrilha[] {
  const trilha: NivelTrilha[] = [];

  for (let i = 1; i <= 30; i++) {
    const nivelAtual: NivelTrilha = {
      nivel: i,
      titulo: `Nível ${i}`,
      blocos: [],
    };

    let contadorFoco = 1;
    let contadorBncc = 1;

    for (let j = 1; j <= 15; j++) {
      if (j % 3 === 0) {
        nivelAtual.blocos.push({
          id: `nivel-${i}-bncc-${contadorBncc}`,
          tipo: 'bncc',
          titulo: `Revisão BNCC ${contadorBncc}`,
        });
        contadorBncc++;
      } else {
        nivelAtual.blocos.push({
          id: `nivel-${i}-foco-${contadorFoco}`,
          tipo: 'foco',
          titulo: `Foco ${contadorFoco}`,
        });
        contadorFoco++;
      }
    }
    trilha.push(nivelAtual);
  }
  return trilha;
}

export const trilhaPrincipal = gerarTrilhaPrincipal();
