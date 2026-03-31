/**
 * Sistema de filtragem de conteúdo sensível para proteger inputs do usuário
 */

export class ContentFilter {
  private static readonly BLOCKED_KEYWORDS = [
    // Conteúdo sexual - detecta variações e contexto
    /\b(sex|porn|xxx|puta|putar|putaria|safad|tesã|tesao|er[oó]tic|adulto|fetiche)\w*/i,
    /\b(prostitui|escort|strip|nudez|pelad|masturb|transa|orgia|sensual)\w*/i,
    /\b(gostosa|gostoso|bundão|bundao|peito|seios|vagina|p[eê]nis|genital)\w*/i,
    /\b(nudes|sexting|provocante)\w*/i,
    
    // Violência - detecta variações (MAIS ESPECÍFICO para não pegar "Matemática")
    /\b(matar|matou|matei|matando|assassi|suic[ií]d|violent|tortur|estupra|violenta|abusa|massacr|mutil)\w*/i,
    /\b(arma|bomba|terroris|sangue|morte|agressão|espancar)\w*/i,
    
    // Ódio - detecta termos ofensivos e suas variações
    /\b(racis|nazi|fascis|homofob|xenofob|discrimina[cç]ão|[oó]dio|linchamento)\w*/i,
    /\b(viado|bicha|sapatão|macaco|preto|judeu|mu[cç]ulman)\b/i,
    
    // Ilegal - drogas e crimes
    /\b(droga|tr[aá]fico|cocaín|maconha|hero[ií]n|crack|ecstasy|contrabando)\w*/i,
    /\b(hackear|pirataria|roubar|frauda|golpe|crime|estelionato)\w*/i,
    
    // Injection patterns
    /<script|javascript:|onerror=|onclick=|eval\(|DROP\s+TABLE|DELETE\s+FROM/i,
    /\.\.[/\\]|file:\/\/|data:text|base64/i,
  ];

  /**
   * Verifica se o texto é seguro
   */
  static isSafe(text: string): { safe: boolean; reason?: string } {
    if (!text || text.trim().length === 0) {
      return { safe: true };
    }

    const trimmedText = text.trim();

    // 1. Verifica tamanho
    if (trimmedText.length > 500) {
      return { safe: false, reason: "Texto muito longo (máximo 500 caracteres)" };
    }

    // 2. Verifica palavras bloqueadas
    for (const pattern of this.BLOCKED_KEYWORDS) {
      if (pattern.test(trimmedText)) {
        return { safe: false, reason: "Conteúdo inapropriado detectado" };
      }
    }

    // 3. Verifica caracteres especiais excessivos
    const allowedCharsPattern = /[a-zA-Z0-9\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/g;
    const allowedChars = trimmedText.match(allowedCharsPattern) || [];
    const specialChars = trimmedText.length - allowedChars.join('').length;
    
    if (specialChars > trimmedText.length * 0.3) {
      return { safe: false, reason: "Muitos caracteres especiais" };
    }

    // 4. Verifica caracteres repetidos (possível spam)
    if (/(.)\1{10,}/.test(trimmedText)) {
      return { safe: false, reason: "Padrão de spam detectado" };
    }

    return { safe: true };
  }

  /**
   * Sanitiza o texto removendo caracteres perigosos
   */
  static sanitize(text: string): string {
    if (!text) return "";

    return text
      // Remove tags HTML
      .replace(/<[^>]*>/g, '')
      // Remove caracteres de controle
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Remove múltiplos espaços
      .replace(/\s+/g, ' ')
      .trim();
  }
}
