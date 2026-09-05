import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Camera,
  Cross,
  Download,
  ImagePlus,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Share2,
} from 'lucide-react';

import WarningBanner from '../components/WarningBanner';
import StepFlow from '../components/StepFlow';
import InstallAppCard from '../components/InstallAppCard';

import {
  runModel1,
  runModel2,
} from '../ai/inference';

import {
  centers,
} from '../data/centers';

import {
  formatDistance,
  getRecommendedCenters,
  openDirections,
} from '../utils/referral';


export default function Inicio() {

  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const analysisIdRef = useRef(0);

  const navigate = useNavigate();


  // =========================================================
  // FOTO
  // =========================================================

  const [
    preview,
    setPreview
  ] = useState(null);


  /*
    Guarda o arquivo ORIGINAL recebido
    da câmera ou da galeria.

    É este arquivo que será compartilhado
    ou salvo — não a versão 224x224 usada pela IA.
  */

  const [
    selectedFile,
    setSelectedFile
  ] = useState(null);


  const [
    photoActionMessage,
    setPhotoActionMessage
  ] = useState('');


  /*
    Controla o pequeno menu mostrado quando
    o usuário toca em "Trocar imagem".
  */

  const [
    showReplaceOptions,
    setShowReplaceOptions
  ] = useState(false);


  // =========================================================
  // IA
  // =========================================================

  const [
    analysisStatus,
    setAnalysisStatus
  ] = useState('idle');

  // idle
  // analyzing
  // complete
  // error

  const [
    analysisStage,
    setAnalysisStage
  ] = useState('');

  const [
    result,
    setResult
  ] = useState(null);

  const [
    error,
    setError
  ] = useState(null);


  // =========================================================
  // LOCALIZAÇÃO
  // =========================================================

  const [
    userLocation,
    setUserLocation
  ] = useState(null);

  const [
    locationStatus,
    setLocationStatus
  ] = useState('idle');

  const [
    locationError,
    setLocationError
  ] = useState('');


  // =========================================================
  // LIMPAR URL DA FOTO
  // =========================================================

  useEffect(() => {

    return () => {

      if (preview) {

        URL.revokeObjectURL(
          preview
        );
      }
    };

  }, [preview]);


  // =========================================================
  // LOCALIZAÇÃO
  // =========================================================

  function requestLocation() {

    if (!navigator.geolocation) {

      setLocationStatus(
        'error'
      );

      setLocationError(
        'Seu navegador não oferece suporte à geolocalização.'
      );

      return;
    }


    setLocationStatus(
      'loading'
    );

    setLocationError(
      ''
    );


    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,
        });


        setLocationStatus(
          'success'
        );
      },


      (geoError) => {

        setLocationStatus(
          'error'
        );


        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {

          setLocationError(
            'O acesso à localização foi bloqueado. Permita o uso da localização para encontrar o centro mais próximo.'
          );

          return;
        }


        if (
          geoError.code ===
          geoError.POSITION_UNAVAILABLE
        ) {

          setLocationError(
            'Não foi possível determinar sua localização neste momento.'
          );

          return;
        }


        if (
          geoError.code ===
          geoError.TIMEOUT
        ) {

          setLocationError(
            'A localização demorou mais que o esperado. Tente novamente.'
          );

          return;
        }


        setLocationError(
          'Não foi possível acessar sua localização.'
        );
      },


      {
        enableHighAccuracy: true,

        timeout: 12000,

        maximumAge: 30000,
      }
    );
  }


  // =========================================================
  // PIPELINE DA IA
  // =========================================================

  async function analyzeImage(
    file,
    analysisId
  ) {

    try {

      setAnalysisStatus(
        'analyzing'
      );

      setAnalysisStage(
        'Analisando a imagem...'
      );

      setResult(
        null
      );

      setError(
        null
      );


      // =====================================================
      // MODELO 1
      // =====================================================

      const model1 =
        await runModel1(
          file
        );


      if (
        analysisId !==
        analysisIdRef.current
      ) {

        return;
      }


      // =====================================================
      // MODELO 1 NÃO CONFIRMOU COBRA
      // =====================================================

      if (
        !model1.snakeDetected
      ) {

        setResult({

          type:
            'inconclusivo_modelo1',

          title:
            'Não foi possível confirmar a serpente pela imagem',

          description:
            'A análise por imagem pode falhar. Em caso de acidente ou suspeita de acidente, procure atendimento no centro de referência antiofídico mais próximo.',

          referralMode:
            'nearest',

          requiredAntivenoms:
            [],
        });


        setAnalysisStatus(
          'complete'
        );

        setAnalysisStage(
          ''
        );

        return;
      }


      // =====================================================
      // MODELO 2
      // =====================================================

      setAnalysisStage(
        'Avaliando o grupo da serpente...'
      );


      const model2 =
        await runModel2(
          file
        );


      if (
        analysisId !==
        analysisIdRef.current
      ) {

        return;
      }


      const operational =
        model2.operational;


      // =====================================================
      // MODELO 2 INCONCLUSIVO
      // =====================================================

      if (
        !operational.accepted
      ) {

        setResult({

          type:
            'inconclusivo_modelo2',

          title:
            'Não foi possível obter uma identificação confiável pela imagem.',

          description:
            'Em caso de acidente ou suspeita de acidente, procure o centro de referência antiofídico mais próximo para avaliação.',

          referralMode:
            'nearest',

          requiredAntivenoms:
            [],
        });


        setAnalysisStatus(
          'complete'
        );

        setAnalysisStage(
          ''
        );

        return;
      }


      // =====================================================
      // BOTRÓPICO / CROTÁLICO
      // =====================================================

      if (
        operational.operationalResult ===
        'botropico_crotalico'
      ) {

        setResult({

          type:
            'botropico_crotalico',

          title:
            'Padrão compatível com grupo botrópico/crotálico',

          description:
            'A análise indica necessidade de atendimento em um centro com cobertura para acidentes botrópicos e crotálicos.',

          referralMode:
            'compatible',

          requiredAntivenoms: [
            'Botrópico',
            'Crotálico',
          ],
        });


        setAnalysisStatus(
          'complete'
        );

        setAnalysisStage(
          ''
        );

        return;
      }


      // =====================================================
      // ELAPÍDICO
      // =====================================================

      if (
        operational.operationalResult ===
        'elapico'
      ) {

        setResult({

          type:
            'elapico',

          title:
            'Padrão compatível com grupo elapídico',

          description:
            'A análise indica necessidade de atendimento em um centro com cobertura para acidente elapídico.',

          referralMode:
            'compatible',

          requiredAntivenoms: [
            'Elapídico',
          ],
        });


        setAnalysisStatus(
          'complete'
        );

        setAnalysisStage(
          ''
        );

        return;
      }


      // =====================================================
      // LAQUÉTICO
      // =====================================================

      if (
        operational.operationalResult ===
        'laquetico'
      ) {

        setResult({

          type:
            'laquetico',

          title:
            'Padrão compatível com grupo laquético',

          description:
            'A análise indica necessidade de atendimento em um centro com cobertura para acidente laquético.',

          referralMode:
            'compatible',

          requiredAntivenoms: [
            'Laquético',
          ],
        });


        setAnalysisStatus(
          'complete'
        );

        setAnalysisStage(
          ''
        );

        return;
      }


      // =====================================================
      // FALLBACK CONSERVADOR
      // =====================================================

      setResult({

        type:
          'inconclusivo',

        title:
          'Análise inconclusiva',

        description:
          'Não foi possível determinar o grupo da serpente com segurança. Procure o centro de referência antiofídico mais próximo.',

        referralMode:
          'nearest',

        requiredAntivenoms:
          [],
      });


      setAnalysisStatus(
        'complete'
      );

      setAnalysisStage(
        ''
      );


    } catch (err) {

      console.error(
        '[Rota Ofídica] Erro na análise:',
        err
      );


      if (
        analysisId !==
        analysisIdRef.current
      ) {

        return;
      }


      setAnalysisStatus(
        'error'
      );

      setAnalysisStage(
        ''
      );


      setError(
        'Não foi possível realizar a análise da imagem. Se houver acidente ou suspeita, procure atendimento em um centro de referência.'
      );
    }
  }


  // =========================================================
  // RECEBER FOTO
  // =========================================================

  function handleFile(
    file
  ) {

    if (
      !file ||
      !file.type?.startsWith(
        'image/'
      )
    ) {

      return;
    }


    analysisIdRef.current += 1;


    const analysisId =
      analysisIdRef.current;


    if (preview) {

      URL.revokeObjectURL(
        preview
      );
    }


    const objectUrl =
      URL.createObjectURL(
        file
      );


    setPreview(
      objectUrl
    );


    setSelectedFile(
      file
    );


    setPhotoActionMessage(
      ''
    );


    /*
      Fecha o menu de troca após
      uma nova imagem entrar.
    */

    setShowReplaceOptions(
      false
    );


    analyzeImage(
      file,
      analysisId
    );
  }


  // =========================================================
  // CÂMERA
  // =========================================================

  function onCameraChange(
    event
  ) {

    const file =
      event.target.files?.[0];


    handleFile(
      file
    );


    event.target.value =
      '';
  }


  // =========================================================
  // GALERIA
  // =========================================================

  function onGalleryChange(
    event
  ) {

    const file =
      event.target.files?.[0];


    handleFile(
      file
    );


    event.target.value =
      '';
  }


  // =========================================================
  // TROCAR IMAGEM
  // =========================================================

  function replaceWithCamera() {

    setShowReplaceOptions(
      false
    );


    cameraRef.current?.click();
  }


  function replaceWithGallery() {

    setShowReplaceOptions(
      false
    );


    fileRef.current?.click();
  }


  // =========================================================
  // EXTENSÃO DO ARQUIVO
  // =========================================================

  function getPhotoExtension(
    file
  ) {

    const extensions = {

      'image/jpeg':
        'jpg',

      'image/png':
        'png',

      'image/webp':
        'webp',

      'image/heic':
        'heic',

      'image/heif':
        'heif',
    };


    if (
      file?.type &&
      extensions[file.type]
    ) {

      return extensions[
        file.type
      ];
    }


    const originalExtension =
      file?.name
        ?.split('.')
        ?.pop()
        ?.toLowerCase();


    return (
      originalExtension ||
      'jpg'
    );
  }


  // =========================================================
  // NOME PARA FOTO
  // =========================================================

  function createPhotoFileName() {

    const extension =
      getPhotoExtension(
        selectedFile
      );


    const timestamp =
      new Date()
        .toISOString()
        .replace(
          /[:.]/g,
          '-'
        );


    return (
      `rota-ofidica-serpente-${timestamp}.${extension}`
    );
  }


  // =========================================================
  // SALVAR FOTO
  // =========================================================

  function saveSelectedPhoto() {

    if (!selectedFile) {

      return;
    }


    try {

      const objectUrl =
        URL.createObjectURL(
          selectedFile
        );


      const link =
        document.createElement(
          'a'
        );


      link.href =
        objectUrl;

      link.download =
        createPhotoFileName();


      document.body.appendChild(
        link
      );


      link.click();


      link.remove();


      setTimeout(
        () => {

          URL.revokeObjectURL(
            objectUrl
          );

        },
        1500
      );


      setPhotoActionMessage(
        'O navegador iniciou o salvamento da foto.'
      );


    } catch (saveError) {

      console.error(
        '[Rota Ofídica] Erro ao salvar foto:',
        saveError
      );


      setPhotoActionMessage(
        'Não foi possível salvar a foto neste navegador. Você ainda pode tentar compartilhá-la.'
      );
    }
  }


  // =========================================================
  // COMPARTILHAR FOTO
  // =========================================================

  async function shareSelectedPhoto() {

    if (!selectedFile) {

      return;
    }


    try {

      if (
        typeof navigator.share !==
        'function'
      ) {

        saveSelectedPhoto();

        setPhotoActionMessage(
          'O compartilhamento direto não está disponível neste navegador. O salvamento da foto foi iniciado.'
        );

        return;
      }


      if (
        typeof navigator.canShare ===
        'function' &&
        !navigator.canShare({
          files: [
            selectedFile
          ]
        })
      ) {

        saveSelectedPhoto();

        setPhotoActionMessage(
          'Este navegador não permite compartilhar arquivos diretamente. O salvamento da foto foi iniciado.'
        );

        return;
      }


      await navigator.share({

        title:
          'Foto da serpente - Rota Ofídica',

        text:
          'Foto registrada para auxiliar a equipe de saúde na avaliação do caso.',

        files: [
          selectedFile
        ],
      });


      setPhotoActionMessage(
        'Foto compartilhada.'
      );


    } catch (shareError) {

      if (
        shareError?.name ===
        'AbortError'
      ) {

        return;
      }


      console.error(
        '[Rota Ofídica] Erro ao compartilhar foto:',
        shareError
      );


      setPhotoActionMessage(
        'Não foi possível compartilhar a foto. Você ainda pode usar a opção “Salvar foto”.'
      );
    }
  }


  // =========================================================
  // CENTROS
  // =========================================================

  const recommendedCenters =
    useMemo(() => {

      if (!result) {

        return [];
      }


      return getRecommendedCenters({

        centers,

        userLocation,

        referralMode:
          result.referralMode,

        requiredAntivenoms:
          result.requiredAntivenoms ??
          [],
      });

    }, [
      result,
      userLocation,
    ]);


  const visibleCenters =
    recommendedCenters.slice(
      0,
      3
    );


  // =========================================================
  // JSX
  // =========================================================

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
          ÁREA PRINCIPAL
         =================================================== */}

      <section className="upload-section">


        {/* =================================================
            QUADRO DA FOTO
           ================================================= */}

        <div className="upload-card">

          <div
            className="upload-dropzone"
            style={
              preview
                ? {
                    padding: 0,

                    overflow:
                      'hidden',

                    position:
                      'relative',
                  }
                : undefined
            }
          >


            {/* ===============================================
                SEM FOTO
               =============================================== */}

            {!preview && (

              <>

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

                  A imagem será usada para avaliar o risco
                  e orientar o encaminhamento adequado.

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

              </>

            )}


            {/* ===============================================
                FOTO DENTRO DO QUADRO
               =============================================== */}

            {preview && (

              <>

                <img
                  src={preview}
                  alt="Imagem selecionada para análise"
                  style={{

                    display:
                      'block',

                    width:
                      '100%',

                    height:
                      '360px',

                    objectFit:
                      'contain',

                    background:
                      '#edf2ee',
                  }}
                />


                {/* ===========================================
                    TROCAR IMAGEM
                   =========================================== */}

                <div
                  style={{

                    position:
                      'absolute',

                    right:
                      '14px',

                    bottom:
                      '14px',

                    zIndex:
                      5,

                    display:
                      'flex',

                    flexDirection:
                      'column',

                    alignItems:
                      'flex-end',

                    gap:
                      '8px',
                  }}
                >


                  {/* =========================================
                      MENU COM AS DUAS OPÇÕES
                     ========================================= */}

                  {
                    showReplaceOptions
                    &&
                    (
                      <div
                        style={{

                          display:
                            'flex',

                          flexDirection:
                            'column',

                          gap:
                            '7px',

                          padding:
                            '8px',

                          borderRadius:
                            '16px',

                          background:
                            'rgba(255,255,255,0.97)',

                          boxShadow:
                            '0 6px 20px rgba(0,0,0,0.18)',
                        }}
                      >


                        <button
                          type="button"
                          onClick={
                            replaceWithCamera
                          }
                          style={{

                            display:
                              'flex',

                            alignItems:
                              'center',

                            gap:
                              '8px',

                            border:
                              'none',

                            borderRadius:
                              '12px',

                            padding:
                              '10px 13px',

                            background:
                              '#164A3A',

                            color:
                              '#FFFFFF',

                            fontWeight:
                              700,

                            cursor:
                              'pointer',

                            whiteSpace:
                              'nowrap',
                          }}
                        >

                          <Camera
                            size={18}
                            strokeWidth={2}
                          />

                          Tirar outra foto

                        </button>


                        <button
                          type="button"
                          onClick={
                            replaceWithGallery
                          }
                          style={{

                            display:
                              'flex',

                            alignItems:
                              'center',

                            gap:
                              '8px',

                            border:
                              '1px solid rgba(22,74,58,0.18)',

                            borderRadius:
                              '12px',

                            padding:
                              '10px 13px',

                            background:
                              '#FFFFFF',

                            color:
                              '#164A3A',

                            fontWeight:
                              700,

                            cursor:
                              'pointer',

                            whiteSpace:
                              'nowrap',
                          }}
                        >

                          <ImagePlus
                            size={18}
                            strokeWidth={2}
                          />

                          Escolher da galeria

                        </button>


                      </div>
                    )
                  }


                  {/* =========================================
                      BOTÃO PRINCIPAL
                     ========================================= */}

                  <button
                    type="button"
                    disabled={
                      analysisStatus ===
                      'analyzing'
                    }
                    onClick={() =>
                      setShowReplaceOptions(
                        (current) =>
                          !current
                      )
                    }
                    style={{

                      display:
                        'inline-flex',

                      alignItems:
                        'center',

                      gap:
                        '7px',

                      border:
                        'none',

                      borderRadius:
                        '999px',

                      padding:
                        '10px 14px',

                      background:
                        'rgba(255,255,255,0.95)',

                      color:
                        '#164A3A',

                      fontWeight:
                        700,

                      cursor:
                        analysisStatus ===
                        'analyzing'
                          ?
                          'not-allowed'
                          :
                          'pointer',

                      opacity:
                        analysisStatus ===
                        'analyzing'
                          ?
                          0.7
                          :
                          1,

                      boxShadow:
                        '0 4px 14px rgba(0,0,0,0.14)',
                    }}
                  >

                    <RefreshCw
                      size={17}
                    />

                    Trocar imagem

                  </button>


                </div>

              </>

            )}


            {/* ===============================================
                INPUTS
               =============================================== */}

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


        {/* =================================================
            AVISO
           ================================================= */}

        <WarningBanner>

          <strong>

            Não se aproxime e não tente capturar a serpente.

          </strong>

          <br />

          Sua segurança vem sempre em primeiro lugar.

        </WarningBanner>


        {/* =================================================
            RESULTADO DA IA
           ================================================= */}

        {preview && (

          <div className="preview-card visible">


            <div
              className="analysis-state"
              aria-live="polite"
            >


              {
                analysisStatus ===
                'analyzing'
                &&
                (
                  <>

                    <h3>
                      Analisando imagem...
                    </h3>

                    <p>
                      {analysisStage}
                    </p>

                  </>
                )
              }


              {
                analysisStatus ===
                'complete'
                &&
                result
                &&
                (
                  <>

                    <h3>
                      {result.title}
                    </h3>

                    <p>
                      {result.description}
                    </p>

                  </>
                )
              }


              {
                analysisStatus ===
                'error'
                &&
                (
                  <>

                    <h3>
                      Não foi possível concluir a análise
                    </h3>

                    <p>
                      {error}
                    </p>


                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(
                          '/centros'
                        )
                      }
                    >

                      Ver centros de referência

                    </button>

                  </>
                )
              }


            </div>

          </div>

        )}


        {/* =================================================
            PEDIR LOCALIZAÇÃO
           ================================================= */}

        {
          analysisStatus ===
          'complete'
          &&
          result
          &&
          !userLocation
          &&
          (
            <div
              className="location-success"
              style={{
                marginTop:
                  '18px',

                marginBottom:
                  '14px',
              }}
            >

              <LocateFixed
                size={19}
              />


              <div
                style={{
                  flex:
                    1,
                }}
              >

                <strong>
                  Encontre o centro mais próximo
                </strong>

                <div
                  style={{
                    marginTop:
                      '3px',
                  }}
                >

                  Ative sua localização para ordenar
                  as unidades pela distância até você.

                </div>

              </div>


              <button
                type="button"
                className="location-button"
                onClick={
                  requestLocation
                }
                disabled={
                  locationStatus ===
                  'loading'
                }
              >

                <LocateFixed
                  size={19}
                />

                {
                  locationStatus ===
                  'loading'
                    ?
                    'Obtendo localização...'
                    :
                    'Usar minha localização'
                }

              </button>

            </div>
          )
        }


        {/* =================================================
            LOCALIZAÇÃO OBTIDA
           ================================================= */}

        {
          analysisStatus ===
          'complete'
          &&
          userLocation
          &&
          (
            <div
              className="location-success"
              style={{
                marginTop:
                  '18px',

                marginBottom:
                  '14px',
              }}
            >

              <LocateFixed
                size={18}
              />

              <span>

                Localização obtida.
                Os centros foram ordenados
                pela distância até você.

              </span>

            </div>
          )
        }


        {/* =================================================
            ERRO DE LOCALIZAÇÃO
           ================================================= */}

        {
          locationStatus ===
          'error'
          &&
          locationError
          &&
          (
            <div
              className="location-error"
              style={{
                marginTop:
                  '14px',
              }}
            >

              <MapPin
                size={18}
              />

              <span>
                {locationError}
              </span>

            </div>
          )
        }


        {/* =================================================
            CENTROS RECOMENDADOS
           ================================================= */}

        {
          analysisStatus ===
          'complete'
          &&
          result
          &&
          visibleCenters.length > 0
          &&
          (
            <section
              className="centers-results"
              style={{
                marginTop:
                  '24px',
              }}
            >


              <div className="centers-results-header">

                <h2>

                  {
                    userLocation
                      ?
                      (
                        result.referralMode ===
                        'compatible'
                          ?
                          'Centros recomendados'
                          :
                          'Centros de referência mais próximos'
                      )
                      :
                      (
                        result.referralMode ===
                        'compatible'
                          ?
                          'Centros compatíveis'
                          :
                          'Centros de referência'
                      )
                  }

                </h2>


                <span>

                  {visibleCenters.length}

                  {' '}

                  {
                    visibleCenters.length === 1
                      ?
                      'opção'
                      :
                      'opções'
                  }

                </span>

              </div>


              <div className="centers-list">


                {
                  visibleCenters.map(
                    (
                      center,
                      index
                    ) => (

                      <article
                        key={center.id}
                        className="center-card"
                      >


                        <div className="center-card-top">


                          <div className="center-icon">

                            <Cross
                              size={24}
                              strokeWidth={2.5}
                            />

                          </div>


                          <div className="center-main-info">


                            {
                              userLocation
                              &&
                              index === 0
                              &&
                              (
                                <span className="nearest-badge">

                                  {
                                    result.referralMode ===
                                    'compatible'
                                      ?
                                      'Mais próximo compatível'
                                      :
                                      'Mais próximo'
                                  }

                                </span>
                              )
                            }


                            <h3>
                              {center.name}
                            </h3>


                            {
                              center.distance !== null
                              &&
                              center.distance !== undefined
                              &&
                              (
                                <div className="center-distance">

                                  <MapPin
                                    size={15}
                                  />

                                  <strong>

                                    {
                                      formatDistance(
                                        center.distance
                                      )
                                    }

                                  </strong>

                                </div>
                              )
                            }


                          </div>

                        </div>


                        <div className="center-details">


                          <div className="center-detail-row">

                            <MapPin
                              size={18}
                            />

                            <span>
                              {center.city}
                            </span>

                          </div>


                          {
                            center.phone
                            &&
                            (
                              <a
                                className="center-detail-row center-phone"
                                href={`tel:${center.phoneRaw}`}
                              >

                                <Phone
                                  size={18}
                                />

                                <span>
                                  {center.phone}
                                </span>

                              </a>
                            )
                          }


                        </div>


                        {
                          center.antivenoms?.length > 0
                          &&
                          (
                            <div className="center-antivenoms">


                              <span className="antivenom-label">

                                Soros disponíveis

                              </span>


                              <div className="antivenom-tags">


                                {
                                  center.antivenoms.map(
                                    (
                                      antivenom
                                    ) => (

                                      <span
                                        key={antivenom}
                                        className="antivenom-tag"
                                      >

                                        {antivenom}

                                      </span>
                                    )
                                  )
                                }


                              </div>

                            </div>
                          )
                        }


                        <button
                          type="button"
                          className="directions-button"
                          onClick={() =>
                            openDirections(
                              center
                            )
                          }
                        >

                          <Navigation
                            size={18}
                          />

                          Como chegar

                        </button>


                      </article>
                    )
                  )
                }


              </div>


              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  width:
                    '100%',

                  marginTop:
                    '14px',
                }}
                onClick={() =>
                  navigate(
                    '/centros'
                  )
                }
              >

                Ver todos os centros

              </button>


            </section>
          )
        }


        {/* =================================================
            FOTO PARA O ATENDIMENTO
           ================================================= */}

        {
          selectedFile
          &&
          (
            analysisStatus ===
            'complete'
            ||
            analysisStatus ===
            'error'
          )
          &&
          (
            <div
              className="preview-card visible"
              style={{
                marginTop:
                  '22px',
              }}
            >


              <div className="analysis-state">


                <h3>
                  Leve esta foto ao atendimento
                </h3>


                <p>

                  A imagem da serpente pode ajudar
                  a equipe de saúde na avaliação do caso.
                  Salve-a no aparelho ou compartilhe-a
                  para mantê-la disponível durante o atendimento.

                </p>


                <div
                  className="button-stack"
                  style={{
                    marginTop:
                      '14px',
                  }}
                >


                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      saveSelectedPhoto
                    }
                  >

                    <Download
                      size={19}
                      strokeWidth={2}
                    />

                    Salvar foto

                  </button>


                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      shareSelectedPhoto
                    }
                  >

                    <Share2
                      size={19}
                      strokeWidth={2}
                    />

                    Compartilhar foto

                  </button>


                </div>


                {
                  photoActionMessage
                  &&
                  (
                    <p
                      aria-live="polite"
                      style={{

                        marginTop:
                          '12px',

                        marginBottom:
                          0,

                        fontSize:
                          '0.9rem',

                        opacity:
                          0.78,
                      }}
                    >

                      {photoActionMessage}

                    </p>
                  )
                }


              </div>

            </div>
          )
        }


      </section>


      {/* ===================================================
          COMO FUNCIONA
         =================================================== */}

      <StepFlow />


      {/* ===================================================
          INSTALAÇÃO
         =================================================== */}

      <InstallAppCard />


    </div>
  );
}