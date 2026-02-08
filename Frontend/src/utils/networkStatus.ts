/**
 * Utilitário para verificar o status da conexão com a internet
 */

/**
 * Verifica se há conexão com a internet
 * Tenta fazer uma requisição HEAD para o próprio servidor backend
 * @returns Promise<boolean> - true se houver conexão, false caso contrário
 */
export async function checkInternetConnection(): Promise<boolean> {
  // Primeiro verifica se o navegador está online
  if (!navigator.onLine) {
    console.log('🔴 Navigator indica que está offline');
    return false;
  }

  try {
    // Tenta fazer uma requisição simples para verificar conectividade real
    // Usa o endpoint de health check do backend se disponível
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Timeout de 3 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${backendUrl}/api/health/`, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('🟢 Conexão com backend confirmada');
      return true;
    }
    
    console.log('🟡 Backend não respondeu corretamente, tentando fallback...');
    // Se o backend não responder, tenta uma requisição externa como fallback
    return await checkExternalConnection();
    
  } catch (error) {
    console.log('🔴 Erro ao conectar com backend:', error);
    // Tenta uma requisição externa como fallback
    return await checkExternalConnection();
  }
}

/**
 * Tenta verificar conexão usando um serviço externo confiável
 */
async function checkExternalConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // Tenta conectar com a API do Google (usada pelo Gemini)
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors', // Evita problemas de CORS
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);
    console.log('🟢 Conexão externa confirmada');
    return true;
    
  } catch (error) {
    console.log('🔴 Sem conexão com a internet');
    return false;
  }
}

/**
 * Hook personalizado para monitorar o status da rede em tempo real
 */
export function useNetworkStatus(onStatusChange?: (isOnline: boolean) => void) {
  const handleOnline = () => {
    console.log('🟢 Conexão restaurada');
    onStatusChange?.(true);
  };

  const handleOffline = () => {
    console.log('🔴 Conexão perdida');
    onStatusChange?.(false);
  };

  // Adiciona listeners para eventos de rede do navegador
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Cleanup
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
