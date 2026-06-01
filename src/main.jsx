import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/animations.css"; import { BrowserRouter } from "react-router-dom";

// --- MSW ACTIVADO SOLO EN DESARROLLO ---
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');

    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest(req, print) {
        // Ignorar navegaciones y recursos estáticos
        if (
          req.mode === 'navigate' ||
          req.destination === 'document' ||
          ['style', 'font', 'image', 'script'].includes(req.destination)
        ) {
          return;
        }

        // Ignorar orígenes externos (CDNs)
        try {
          const url = new URL(req.url);
          if (url.origin !== location.origin) return;
        } catch (e) { }

        // Mostrar warning solo para fetch/XHR sin handler
        print.warning();
      },
    });
  }
}


async function main() {
  await enableMocking();

  createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

main();
