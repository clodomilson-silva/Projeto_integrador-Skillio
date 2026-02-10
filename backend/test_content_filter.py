"""
Script de teste automatizado para o sistema de proteção de conteúdo.
Execute: python test_content_filter.py
"""

import sys
import os

# Adiciona o diretório do projeto ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from api.content_filter import ContentFilter
from api.validators import validate_safe_content
from rest_framework import serializers

# Cores para output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_test(name, result, expected=True):
    """Imprime resultado do teste"""
    symbol = '✅' if result == expected else '❌'
    color = GREEN if result == expected else RED
    print(f"{color}{symbol} {name}{RESET}")

def test_blocked_words():
    """Testa bloqueio de palavras sensíveis"""
    print(f"\n{BLUE}=== Testando Palavras Bloqueadas ==={RESET}")
    
    blocked_tests = [
        # Sexual - palavras exatas
        ("sexo", False, "Conteúdo sexual"),
        ("pornografia", False, "Conteúdo sexual"),
        ("xxx", False, "Conteúdo sexual"),
        ("putaria", False, "Conteúdo sexual - putaria"),
        ("puta", False, "Conteúdo sexual - puta"),
        ("safadeza", False, "Conteúdo sexual - safad*"),
        ("tesão", False, "Conteúdo sexual - tesão"),
        
        # Sexual - variações (testa padrão regex)
        ("puteiro", False, "Conteúdo sexual - putar*"),
        ("sexualidade", False, "Conteúdo sexual - sex*"),
        ("pornográfico", False, "Conteúdo sexual - porn*"),
        ("erótica", False, "Conteúdo sexual - erótic*"),
        
        # Violência
        ("matar", False, "Violência"),
        ("assassinar", False, "Violência"),
        ("bomba", False, "Violência"),
        ("estupro", False, "Violência sexual"),
        
        # Ódio
        ("racismo", False, "Ódio"),
        ("nazi", False, "Ódio"),
        ("homofobia", False, "Ódio"),
        
        # Ilegal
        ("drogas", False, "Ilegal"),
        ("tráfico", False, "Ilegal"),
        ("hackear", False, "Ilegal"),
        ("cocaína", False, "Drogas"),
    ]
    
    passed = 0
    for text, should_pass, category in blocked_tests:
        is_safe, reason = ContentFilter.is_safe(text)
        test_name = f"{category}: '{text}'"
        if not should_pass:  # Deve ser bloqueado
            print_test(test_name, not is_safe, True)
            if not is_safe:
                passed += 1
                print(f"  └─ Razão: {reason}")
        else:
            print_test(test_name, is_safe, True)
            if is_safe:
                passed += 1
    
    print(f"\n{YELLOW}Resultado: {passed}/{len(blocked_tests)} testes passaram{RESET}")

def test_injection_patterns():
    """Testa padrões de injection"""
    print(f"\n{BLUE}=== Testando Padrões de Injection ==={RESET}")
    
    injection_tests = [
        ("<script>alert('xss')</script>", "XSS - Script tags"),
        ("javascript:alert(1)", "XSS - JavaScript protocol"),
        ("DROP TABLE users", "SQL Injection"),
        ("DELETE FROM users", "SQL Injection"),
        ("../../../etc/passwd", "Path Traversal"),
        ("file:///etc/passwd", "File protocol"),
    ]
    
    passed = 0
    for text, description in injection_tests:
        is_safe, reason = ContentFilter.is_safe(text)
        print_test(description, not is_safe, True)
        if not is_safe:
            passed += 1
            print(f"  └─ Razão: {reason}")
    
    print(f"\n{YELLOW}Resultado: {passed}/{len(injection_tests)} testes passaram{RESET}")

def test_valid_inputs():
    """Testa inputs válidos que devem passar"""
    print(f"\n{BLUE}=== Testando Inputs Válidos ==={RESET}")
    
    valid_tests = [
        "Matemática",
        "ENEM",
        "Programação Python",
        "Lógica",
        "Direito Constitucional",
        "História do Brasil",
        "Física Quântica",
        "Estudante de medicina",
    ]
    
    passed = 0
    for text in valid_tests:
        is_safe, reason = ContentFilter.is_safe(text)
        print_test(f"'{text}'", is_safe, True)
        if is_safe:
            passed += 1
    
    print(f"\n{YELLOW}Resultado: {passed}/{len(valid_tests)} testes passaram{RESET}")

def test_sanitization():
    """Testa sanitização de conteúdo"""
    print(f"\n{BLUE}=== Testando Sanitização ==={RESET}")
    
    sanitize_tests = [
        ("<b>Texto</b>", "Texto", "Remove HTML tags"),
        ("  Texto   com   espaços  ", "Texto com espaços", "Remove espaços extras"),
        ("<script>alert('xss')</script>Matemática", "Matemática", "Remove scripts e limpa"),
    ]
    
    passed = 0
    for input_text, expected, description in sanitize_tests:
        result = ContentFilter.sanitize(input_text)
        test_passed = result == expected
        print_test(description, test_passed, True)
        if test_passed:
            passed += 1
            print(f"  └─ '{input_text}' → '{result}'")
        else:
            print(f"  └─ Esperado: '{expected}', Obtido: '{result}'")
    
    print(f"\n{YELLOW}Resultado: {passed}/{len(sanitize_tests)} testes passaram{RESET}")

def test_validator():
    """Testa o validador do Django REST"""
    print(f"\n{BLUE}=== Testando Validador Django ==={RESET}")
    
    validator_tests = [
        ("Matemática", True, "Texto válido"),
        ("sexo", False, "Conteúdo bloqueado"),
        ("DROP TABLE", False, "SQL Injection"),
    ]
    
    passed = 0
    for text, should_pass, description in validator_tests:
        try:
            result = validate_safe_content(text, "teste")
            test_passed = should_pass
            if test_passed:
                print_test(description, True, True)
                passed += 1
            else:
                print_test(f"{description} - NÃO DEVERIA PASSAR!", False, True)
        except serializers.ValidationError as e:
            test_passed = not should_pass
            if test_passed:
                print_test(description, True, True)
                print(f"  └─ Erro: {str(e)}")
                passed += 1
            else:
                print_test(f"{description} - NÃO DEVERIA BLOQUEAR!", False, True)
    
    print(f"\n{YELLOW}Resultado: {passed}/{len(validator_tests)} testes passaram{RESET}")

def test_edge_cases():
    """Testa casos extremos"""
    print(f"\n{BLUE}=== Testando Casos Extremos ==={RESET}")
    
    edge_tests = [
        ("", True, "String vazia"),
        ("a" * 500, True, "500 caracteres (limite)"),
        ("a" * 501, False, "501 caracteres (acima do limite)"),
        ("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", False, "Muitos caracteres especiais"),
        ("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", True, "Muitos caracteres repetidos normal"),
    ]
    
    passed = 0
    for text, should_pass, description in edge_tests:
        is_safe, reason = ContentFilter.is_safe(text)
        test_passed = is_safe == should_pass
        print_test(description, test_passed, True)
        if test_passed:
            passed += 1
            if not is_safe:
                print(f"  └─ Razão: {reason}")
    
    print(f"\n{YELLOW}Resultado: {passed}/{len(edge_tests)} testes passaram{RESET}")

def main():
    """Executa todos os testes"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}🧪 TESTES DO SISTEMA DE PROTEÇÃO DE CONTEÚDO{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    
    test_blocked_words()
    test_injection_patterns()
    test_valid_inputs()
    test_sanitization()
    test_validator()
    test_edge_cases()
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{GREEN}✅ Testes concluídos!{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

if __name__ == "__main__":
    main()
