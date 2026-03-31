import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

// Só renderiza o ReCaptcha se a chave estiver configurada
const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

createRoot(document.getElementById("root")!).render(
  RECAPTCHA_SITE_KEY ? (
    <GoogleReCaptchaProvider 
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <AppWithProviders />
    </GoogleReCaptchaProvider>
  ) : (
    <AppWithProviders />
  )
);