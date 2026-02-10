"""
Validadores customizados para campos de entrada do usuário.
"""
from rest_framework import serializers
from .content_filter import ContentFilter


def validate_safe_content(value: str, field_name: str = "campo") -> str:
    """
    Validador para campos que exigem conteúdo seguro.
    
    Args:
        value: Valor a ser validado
        field_name: Nome do campo para mensagens de erro
        
    Returns:
        str: Valor sanitizado
        
    Raises:
        serializers.ValidationError: Se o conteúdo for inapropriado
    """
    if not value:
        return value
    
    # Sanitiza primeiro
    sanitized = ContentFilter.sanitize(value)
    
    # Verifica se é seguro
    is_safe, reason = ContentFilter.is_safe(sanitized)
    
    if not is_safe:
        raise serializers.ValidationError(
            f"O {field_name} contém conteúdo inapropriado. {reason}"
        )
    
    return sanitized
