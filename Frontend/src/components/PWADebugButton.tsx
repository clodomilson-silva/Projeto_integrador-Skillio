import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bug, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function PWADebugButton() {
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (!showDebug) return;

    const checkPWA = async () => {
      const info: any = {
        timestamp: new Date().toLocaleString('pt-BR'),
        url: window.location.href,
        userAgent: navigator.userAgent,
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        serviceWorker: {
          supported: 'serviceWorker' in navigator,
          registered: false,
          active: false,
        },
        manifest: {
          exists: false,
          loaded: false,
          data: null,
        },
        beforeInstallPrompt: {
          fired: false,
        },
        icons: {
          pwa64: false,
          pwa192: false,
          pwa512: false,
        }
      };

      // Check Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          info.serviceWorker.registered = !!registration;
          info.serviceWorker.active = registration?.active?.state === 'activated';
        } catch (e) {
          console.error('Erro ao verificar Service Worker:', e);
        }
      }

      // Check Manifest
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        info.manifest.exists = !!manifestLink;
        
        if (manifestLink) {
          const manifestUrl = (manifestLink as HTMLLinkElement).href;
          const response = await fetch(manifestUrl);
          info.manifest.loaded = response.ok;
          if (response.ok) {
            info.manifest.data = await response.json();
          }
        }
      } catch (e) {
        console.error('Erro ao verificar Manifest:', e);
      }

      // Check Icons
      const checkIcon = async (path: string) => {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          return response.ok;
        } catch {
          return false;
        }
      };

      info.icons.pwa64 = await checkIcon('/pwa-64x64.png');
      info.icons.pwa192 = await checkIcon('/pwa-192x192.png');
      info.icons.pwa512 = await checkIcon('/pwa-512x512.png');

      // iOS Detection
      info.iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      
      setDebugInfo(info);
    };

    checkPWA();
  }, [showDebug]);

  const Status = ({ ok }: { ok: boolean }) => (
    ok ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  );

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-20 right-4 z-50 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg"
        title="Debug PWA"
      >
        <Bug className="h-5 w-5" />
      </button>
    );
  }

  const allOk = 
    debugInfo.serviceWorker?.registered &&
    debugInfo.serviceWorker?.active &&
    debugInfo.manifest?.loaded &&
    debugInfo.icons?.pwa64 &&
    debugInfo.icons?.pwa192 &&
    debugInfo.icons?.pwa512;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bug className="h-6 w-6" />
              Debug PWA
              {allOk ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              )}
            </h2>
            <Button onClick={() => setShowDebug(false)} variant="ghost">
              Fechar
            </Button>
          </div>

          <div className="space-y-3 text-sm font-mono">
            <div className="p-3 bg-muted rounded">
              <strong>🌐 URL:</strong> {debugInfo.url}
            </div>

            <div className="p-3 bg-muted rounded">
              <strong>📱 Dispositivo:</strong>
              <div className="mt-1">
                {debugInfo.iOS ? '🍎 iOS' : '🤖 Android/Outros'}
              </div>
            </div>

            <div className="p-3 bg-muted rounded">
              <strong>📱 Modo Standalone:</strong>
              <div className="flex items-center gap-2 mt-1">
                <Status ok={debugInfo.standalone} />
                {debugInfo.standalone ? 'Sim (App Instalado)' : 'Não (Navegador Normal)'}
              </div>
            </div>

            <div className="p-3 bg-muted rounded">
              <strong>⚙️ Service Worker:</strong>
              <div className="ml-4 mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.serviceWorker?.supported} />
                  Suportado: {debugInfo.serviceWorker?.supported ? 'Sim' : 'Não'}
                </div>
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.serviceWorker?.registered} />
                  Registrado: {debugInfo.serviceWorker?.registered ? 'Sim' : 'Não'}
                </div>
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.serviceWorker?.active} />
                  Ativo: {debugInfo.serviceWorker?.active ? 'Sim' : 'Não'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted rounded">
              <strong>📄 Manifest:</strong>
              <div className="ml-4 mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.manifest?.exists} />
                  Tag existe: {debugInfo.manifest?.exists ? 'Sim' : 'Não'}
                </div>
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.manifest?.loaded} />
                  Carregado: {debugInfo.manifest?.loaded ? 'Sim' : 'Não'}
                </div>
                {debugInfo.manifest?.data && (
                  <div className="mt-2 text-xs">
                    <div>Nome: {debugInfo.manifest.data.name}</div>
                    <div>Display: {debugInfo.manifest.data.display}</div>
                    <div>Start URL: {debugInfo.manifest.data.start_url}</div>
                    <div>Ícones: {debugInfo.manifest.data.icons?.length || 0}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-muted rounded">
              <strong>🖼️ Ícones:</strong>
              <div className="ml-4 mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.icons?.pwa64} />
                  pwa-64x64.png
                </div>
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.icons?.pwa192} />
                  pwa-192x192.png
                </div>
                <div className="flex items-center gap-2">
                  <Status ok={debugInfo.icons?.pwa512} />
                  pwa-512x512.png
                </div>
              </div>
            </div>
          </div>

          {!allOk && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <h3 className="font-bold text-yellow-500 mb-2">⚠️ Problemas Detectados:</h3>
              <ul className="text-sm space-y-1 text-yellow-500">
                {!debugInfo.serviceWorker?.registered && <li>• Service Worker não registrado</li>}
                {!debugInfo.serviceWorker?.active && <li>• Service Worker não ativo</li>}
                {!debugInfo.manifest?.loaded && <li>• Manifest não carregado</li>}
                {!debugInfo.icons?.pwa64 && <li>• Ícone 64x64 não encontrado</li>}
                {!debugInfo.icons?.pwa192 && <li>• Ícone 192x192 não encontrado</li>}
                {!debugInfo.icons?.pwa512 && <li>• Ícone 512x512 não encontrado</li>}
              </ul>
              <div className="mt-3 text-xs">
                <strong>Solução:</strong> Recarregue a página com Ctrl+Shift+R ou limpe o cache
              </div>
            </div>
          )}

          {allOk && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded">
              <h3 className="font-bold text-green-500">✅ PWA Configurado Corretamente!</h3>
              <p className="text-sm text-green-500 mt-1">
                O app pode ser instalado e funcionará offline.
              </p>
            </div>
          )}

          <Button
            onClick={() => {
              console.log('📊 Debug PWA Info:', debugInfo);
              alert('Informações copiadas para o console (F12)');
            }}
            variant="outline"
            className="w-full"
          >
            Copiar Info para Console
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PWADebugButton;
