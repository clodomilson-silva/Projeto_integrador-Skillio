/**
 * Script de teste do ContentFilter no Frontend
 * Cole no console do navegador (F12) para testar
 */

import { ContentFilter } from './contentFilter';

// Cores para output no console
const styles = {
  success: 'color: green; font-weight: bold',
  error: 'color: red; font-weight: bold',
  info: 'color: blue; font-weight: bold',
  warning: 'color: orange; font-weight: bold'
};

interface TestResult {
  passed: number;
  failed: number;
  total: number;
}

function testContentFilter(): void {
  console.log('%c🧪 TESTES DO CONTENT FILTER - FRONTEND', styles.info);
  console.log('%c' + '='.repeat(60), styles.info);

  const allResults: TestResult = { passed: 0, failed: 0, total: 0 };

  // Teste 1: Palavras Bloqueadas
  console.log('\n%c=== Testando Palavras Bloqueadas ===', styles.info);
  const blockedWords = [
    { text: 'sexo', category: 'Sexual' },
    { text: 'pornografia', category: 'Sexual' },
    { text: 'matar', category: 'Violência' },
    { text: 'drogas', category: 'Ilegal' },
    { text: 'racismo', category: 'Ódio' },
  ];

  blockedWords.forEach(({ text, category }) => {
    const result = ContentFilter.isSafe(text);
    allResults.total++;
    if (!result.safe) {
      console.log(`%c✅ ${category}: "${text}" foi BLOQUEADO corretamente`, styles.success);
      console.log(`   Razão: ${result.reason}`);
      allResults.passed++;
    } else {
      console.log(`%c❌ ${category}: "${text}" NÃO foi bloqueado (erro!)`, styles.error);
      allResults.failed++;
    }
  });

  // Teste 2: Padrões de Injection
  console.log('\n%c=== Testando Injeção de Código ===', styles.info);
  const injectionTests = [
    { text: '<script>alert("xss")</script>', desc: 'XSS - Script tag' },
    { text: 'javascript:alert(1)', desc: 'XSS - JavaScript protocol' },
    { text: 'DROP TABLE users', desc: 'SQL Injection' },
    { text: '../../../etc/passwd', desc: 'Path Traversal' },
  ];

  injectionTests.forEach(({ text, desc }) => {
    const result = ContentFilter.isSafe(text);
    allResults.total++;
    if (!result.safe) {
      console.log(`%c✅ ${desc} foi BLOQUEADO`, styles.success);
      console.log(`   Razão: ${result.reason}`);
      allResults.passed++;
    } else {
      console.log(`%c❌ ${desc} NÃO foi bloqueado (erro!)`, styles.error);
      allResults.failed++;
    }
  });

  // Teste 3: Inputs Válidos
  console.log('\n%c=== Testando Inputs Válidos ===', styles.info);
  const validInputs = [
    'Matemática',
    'ENEM',
    'Programação Python',
    'Lógica',
    'História do Brasil',
  ];

  validInputs.forEach((text) => {
    const result = ContentFilter.isSafe(text);
    allResults.total++;
    if (result.safe) {
      console.log(`%c✅ "${text}" foi ACEITO corretamente`, styles.success);
      allResults.passed++;
    } else {
      console.log(`%c❌ "${text}" foi bloqueado incorretamente`, styles.error);
      console.log(`   Razão: ${result.reason}`);
      allResults.failed++;
    }
  });

  // Teste 4: Sanitização
  console.log('\n%c=== Testando Sanitização ===', styles.info);
  const sanitizeTests = [
    { input: '<b>Texto</b>', expected: 'Texto', desc: 'Remove HTML' },
    { input: '  Texto   com   espaços  ', expected: 'Texto com espaços', desc: 'Remove espaços' },
    { input: '<script>alert()</script>Math', expected: 'Math', desc: 'Remove scripts' },
  ];

  sanitizeTests.forEach(({ input, expected, desc }) => {
    const result = ContentFilter.sanitize(input);
    allResults.total++;
    if (result === expected) {
      console.log(`%c✅ ${desc} funcionou`, styles.success);
      console.log(`   "${input}" → "${result}"`);
      allResults.passed++;
    } else {
      console.log(`%c❌ ${desc} falhou`, styles.error);
      console.log(`   Esperado: "${expected}"`);
      console.log(`   Obtido: "${result}"`);
      allResults.failed++;
    }
  });

  // Teste 5: Casos Extremos
  console.log('\n%c=== Testando Casos Extremos ===', styles.info);
  const edgeCases = [
    { text: '', shouldPass: true, desc: 'String vazia' },
    { text: 'a'.repeat(500), shouldPass: true, desc: '500 caracteres (limite)' },
    { text: 'a'.repeat(501), shouldPass: false, desc: '501 caracteres (acima)' },
    { text: '!@#$%^&*()!@#$%^&*()!@#$%^', shouldPass: false, desc: 'Muitos especiais' },
  ];

  edgeCases.forEach(({ text, shouldPass, desc }) => {
    const result = ContentFilter.isSafe(text);
    allResults.total++;
    const testPassed = result.safe === shouldPass;
    if (testPassed) {
      console.log(`%c✅ ${desc} correto`, styles.success);
      if (!result.safe) {
        console.log(`   Razão: ${result.reason}`);
      }
      allResults.passed++;
    } else {
      console.log(`%c❌ ${desc} incorreto`, styles.error);
      console.log(`   Esperado: ${shouldPass ? 'passar' : 'bloquear'}`);
      console.log(`   Resultado: ${result.safe ? 'passou' : 'bloqueou'}`);
      allResults.failed++;
    }
  });

  // Resultado Final
  console.log('\n%c' + '='.repeat(60), styles.info);
  const percentage = ((allResults.passed / allResults.total) * 100).toFixed(1);
  const resultStyle = allResults.failed === 0 ? styles.success : styles.warning;
  
  console.log(
    `%c✅ Testes Passaram: ${allResults.passed}/${allResults.total} (${percentage}%)`,
    resultStyle
  );
  
  if (allResults.failed > 0) {
    console.log(`%c❌ Testes Falharam: ${allResults.failed}`, styles.error);
  } else {
    console.log('%c🎉 Todos os testes passaram!', styles.success);
  }
  
  console.log('%c' + '='.repeat(60), styles.info);
}

// Executar testes
testContentFilter();

// Exportar função para uso manual
export { testContentFilter };
