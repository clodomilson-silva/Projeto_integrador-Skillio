"""
Sistema de filtragem de conteúdo sensível para proteger inputs do usuário.
"""
import re
from typing import Tuple


class ContentFilter:
    """
    Sistema de filtragem de conteúdo sensível para proteger inputs do usuário.
    """
    
    # Palavras e termos bloqueados (categorizados)
    BLOCKED_WORDS = {
        'sexual': [
            'sexo', 'pornografia', 'porno', 'xxx', 'nudez', 'nu', 'nua',
            'prostituição', 'prostituta', 'sexual', 'erótico', 'adulto', 'fetiche',
            'sexu', 'erotic', 'porn', 'putaria', 'puta', 'putas', 'puteiro',
            'safad', 'tesão', 'tesao', 'gostosa', 'gostoso', 'bundão', 'bundao',
            'peito', 'seios', 'vagina', 'pênis', 'penis', 'genital', 'orgia',
            'masturbação', 'masturba', 'transa', 'sexting', 'nudes', 'pelad',
            'stripper', 'prostitui', 'escort', 'sensual', 'provocante'
        ],
        'violence': [
            'matar', 'assassinar', 'suicídio', 'violência', 'tortura',
            'agressão', 'espancar', 'sangue', 'morte', 'arma', 'faca',
            'tiro', 'bomba', 'explosivo', 'terrorismo', 'terrorista',
            'estupro', 'violentar', 'abusar', 'massacre', 'mutil',
            'enforcar', 'guilhotin', 'decapit', 'esfaquear', 'atirar'
        ],
        'hate': [
            'racismo', 'nazi', 'nazismo', 'homofobia', 'xenofobia', 'preconceito',
            'discriminação', 'ódio', 'linchamento', 'fascismo', 'supremacia',
            'inferioridade', 'raça inferior', 'viado', 'bicha', 'sapatão',
            'macaco', 'preto', 'judeu', 'muçulman', 'terrorista'
        ],
        'illegal': [
            'drogas', 'tráfico', 'hacker', 'hackear', 'pirataria',
            'roubar', 'fraudar', 'golpe', 'crime', 'criminoso',
            'cocaína', 'maconha', 'heroína', 'crack', 'ecstasy',
            'traficar', 'contrabando', 'falsificação', 'estelionato'
        ],
        'injection': [
            '<script>', 'javascript:', 'onerror=', 'onclick=', 'onload=',
            'eval(', 'exec(', 'system(', 'DROP TABLE', 'DELETE FROM',
            'INSERT INTO', 'UPDATE SET', '--', ';--', '/*', '*/',
            '../', '..\\', 'file://', 'data:', 'vbscript:', 'base64'
        ]
    }
    
    # Padrões regex mais inteligentes para detectar variações
    BLOCKED_PATTERNS = [
        # Sexual - detecta variações de palavras relacionadas a sexo
        r'\b(?:sex|porn|xxx|puta|putar|safad|tesã|tesao|erótic|erotic)\w*',
        r'\b(?:prostitui|escort|strip|nudez|pelad)\w*',
        r'\b(?:masturb|transa|orgia|sensual)\w*',
        
        # Violência - detecta variações (MAIS ESPECÍFICO para não pegar "Matemática")
        r'\b(?:matar|matou|matei|matando|assassin|suicid|violent|tortur)\w*',
        r'\b(?:estupra|violenta|abusa|massacr|mutil)\w*',
        
        # Ódio - detecta termos ofensivos
        r'\b(?:racis|nazi|fascis|homofob|xenofob)\w*',
        r'\b(?:viado|bicha|sapatão|macaco)\b',
        
        # Drogas
        r'\b(?:cocaín|maconha|heroín|crack|ecstasy|trafic)\w*',
    ]
    
    # Padrões regex suspeitos
    SUSPICIOUS_PATTERNS = [
        r'<[^>]*script[^>]*>',  # Tags script
        r'javascript\s*:',       # Links javascript
        r'on\w+\s*=',           # Event handlers HTML
        r'eval\s*\(',           # Funções perigosas
        r'exec\s*\(',
        r'DROP\s+TABLE',        # SQL injection
        r'DELETE\s+FROM',
        r'INSERT\s+INTO',
        r'\.\./|\.\.\\',        # Path traversal
        r'file\s*:\s*//',       # File protocol
        r'data\s*:\s*text',     # Data URLs
    ]
    
    @classmethod
    def is_safe(cls, text: str) -> Tuple[bool, str]:
        """
        Verifica se o texto é seguro.
        
        Returns:
            Tuple[bool, str]: (is_safe, reason_if_unsafe)
        """
        if not text:
            return True, ""
        
        text_lower = text.lower().strip()
        
        # 1. Verifica padrões regex (detecta variações)
        for pattern in cls.BLOCKED_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return False, "Conteúdo inapropriado detectado"
        
        # 2. Verifica palavras bloqueadas exatas
        for category, words in cls.BLOCKED_WORDS.items():
            for word in words:
                # Verifica palavra exata ou como parte de palavra
                if word in text_lower:
                    return False, "Conteúdo inapropriado detectado"
        
        # 3. Verifica padrões suspeitos (injection, XSS, etc)
        for pattern in cls.SUSPICIOUS_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return False, "Padrão de código malicioso detectado"
        
        # 4. Verifica tamanho excessivo (possível ataque)
        if len(text) > 500:
            return False, "Texto muito longo (máximo 500 caracteres)"
        
        # 5. Verifica caracteres especiais excessivos
        special_chars = sum(1 for c in text if not c.isalnum() and not c.isspace() and c not in 'áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ')
        if special_chars > len(text) * 0.3:  # Mais de 30% de caracteres especiais
            return False, "Muitos caracteres especiais"
        
        return True, ""
    
    @classmethod
    def sanitize(cls, text: str) -> str:
        """
        Limpa o texto removendo caracteres perigosos.
        """
        if not text:
            return ""
        
        # Remove tags HTML
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove caracteres de controle
        text = re.sub(r'[\x00-\x1F\x7F]', '', text)
        
        # Remove múltiplos espaços
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
