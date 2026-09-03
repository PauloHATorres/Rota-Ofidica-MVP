import { useEffect, useRef, useState } from 'react';

import { Camera, ImagePlus } from 'lucide-react';

import WarningBanner from '../components/WarningBanner';
import StepFlow from '../components/StepFlow';
import InstallAppCard from '../components/InstallAppCard';

export default function Inicio() {
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFile(file) {
    if (!file || !file.type?.startsWith('image/')) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(
      URL.createObjectURL(file)
    );
  }

  function onCameraChange(event) {
    handleFile(
      event.target.files?.[0]
    );

    event.target.value = '';
  }

  function onGalleryChange(event) {
    handleFile(
      event.target.files?.[0]
    );

    event.target.value = '';
  }

  return (
    <div className="hero">

      {/* ===================================================
          APRESENTAÇÃO
         =================================================== */}

      <section className="hero-copy">

        <h1 className="page-title">
          Identifique o risco.
          <br />
          Encontre atendimento.
        </h1>

        <p className="page-subtitle">
          Envie uma foto da serpente para uma avaliação preliminar
          e receba orientações seguras para buscar atendimento adequado.
        </p>

      </section>


      {/* ===================================================
          ENVIO DA IMAGEM
         =================================================== */}

      <section className="upload-section">

        <div className="upload-card">

          <div className="upload-dropzone">

            <div
              className="camera-badge"
              aria-hidden="true"
            >
              <Camera
                size={38}
                strokeWidth={1.8}
              />
            </div>


            <h2 className="upload-title">
              Envie uma foto da serpente
            </h2>


            <p className="upload-copy">
              A imagem será usada para avaliar o risco e orientar
              o encaminhamento adequado.
            </p>


            <div className="button-stack">

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  cameraRef.current?.click()
                }
              >
                <Camera
                  size={20}
                  strokeWidth={2}
                />

                Tirar foto
              </button>


              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  fileRef.current?.click()
                }
              >
                <ImagePlus
                  size={20}
                  strokeWidth={2}
                />

                Escolher imagem
              </button>

            </div>


            <input
              ref={cameraRef}
              hidden
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onCameraChange}
            />


            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/*"
              onChange={onGalleryChange}
            />

          </div>

        </div>


        <WarningBanner>
          <strong>
            Não se aproxime e não tente capturar a serpente.
          </strong>

          <br />

          Sua segurança vem sempre em primeiro lugar.
        </WarningBanner>


        {preview && (

          <div className="preview-card visible">

            <img
              className="preview-image"
              src={preview}
              alt="Imagem selecionada para análise"
            />


            <div className="analysis-state">

              <h3>
                Imagem pronta para análise
              </h3>

              <p>
                A interface está preparada para receber o resultado
                do modelo de inteligência artificial.
              </p>

            </div>

          </div>

        )}

      </section>


      {/* ===================================================
          COMO FUNCIONA
         =================================================== */}

      <StepFlow />


      {/* ===================================================
          INSTALAÇÃO DO WEBAPP
         =================================================== */}

      <InstallAppCard />

    </div>
  );
}