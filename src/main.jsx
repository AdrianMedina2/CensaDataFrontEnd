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
    const { worker } = await import("./mocks/browser");
    await worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
      onUnhandledRequest: "bypass",
    });
  }
}

async function main() {
  await enableMocking();

  createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>,
  );
}

main();
