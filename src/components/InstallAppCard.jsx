import { useEffect, useState } from 'react';

import {
  Download,
  Share2
} from 'lucide-react';

import './InstallAppCard.css';


export default function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const [isInstalled, setIsInstalled] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);

  const baseUrl = import.meta.env.BASE_URL;


  useEffect(() => {
    const standalone =
      window.matchMedia(
        '(display-mode: standalone)'
      ).matches ||
      window.navigator.standalone === true;


    if (standalone) {
      setIsInstalled(true);
    }


    function handleBeforeInstallPrompt(event) {
      event.preventDefault();

      setDeferredPrompt(event);
    }


    function handleAppInstalled() {
      setIsInstalled(true);

      setDeferredPrompt(null);

      setShowInstructions(false);
    }


    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );


    window.addEventListener(
      'appinstalled',
      handleAppInstalled
    );


    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );
    };
  }, []);


  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      const result =
        await deferredPrompt.userChoice;


      if (result.outcome === 'accepted') {
        setDeferredPrompt(null);
      }

      return;
    }


    setShowInstructions(true);
  }


  if (isInstalled) {
    return null;
  }


  return (
    <section className="install-app-section">

      <div className="install-app-card">

        <div className="install-app-visual">

          <div className="install-app-logo-card">

            <img
              src={`${baseUrl}images/rota-ofidica-logo.png`}
              alt="Rota Ofídica"
              className="install-app-logo-only"
            />

          </div>

        </div>


        <div className="install-app-content">

          <span className="install-app-eyebrow">
            Acesso rápido
          </span>


          <h2>
            Tenha o Rota Ofídica sempre à mão
          </h2>


          <p>
            Adicione o webapp à tela inicial do seu dispositivo
            e acesse mais rápido quando precisar.
          </p>


          <button
            type="button"
            className="install-app-button"
            onClick={handleInstall}
          >
            <Download
              size={19}
              strokeWidth={2.2}
            />

            Instalar Rota Ofídica
          </button>


          {showInstructions && (

            <div className="install-app-instructions">

              <Share2
                size={19}
                strokeWidth={2}
              />


              <p>
                Se o navegador não abrir a instalação automaticamente,
                use o menu do navegador e escolha
                <strong> Adicionar à Tela de Início </strong>
                ou
                <strong> Instalar app</strong>.
              </p>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}