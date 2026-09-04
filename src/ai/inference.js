import * as ort from 'onnxruntime-web';

import { MODEL_CONFIG } from './modelConfig';
import { preprocessImage } from './preprocessImage';


// ============================================================
// CONFIGURAÇÃO ONNX RUNTIME WEB
// ============================================================

// GitHub Pages não garante o ambiente necessário para
// multithreading via SharedArrayBuffer.
//
// Para o MVP/mobile, começamos com 1 thread.
// Depois podemos otimizar se necessário.

ort.env.wasm.numThreads = 1;


// ============================================================
// SESSÕES
//
// Guardamos a Promise da sessão.
// Assim o modelo é carregado apenas uma vez.
// ============================================================

let model1SessionPromise = null;
let model2SessionPromise = null;


// ============================================================
// SOFTMAX
// ============================================================

function softmax(logits) {
  const maxLogit = Math.max(...logits);

  const expValues = logits.map(
    (value) => Math.exp(value - maxLogit)
  );

  const sum = expValues.reduce(
    (acc, value) => acc + value,
    0
  );

  return expValues.map(
    (value) => value / sum
  );
}


// ============================================================
// CARREGAR MODELO 1
// ============================================================

export async function loadModel1() {
  if (!model1SessionPromise) {
    console.log(
      '[Rota Ofídica] Carregando Modelo 1...'
    );

    console.log(
      '[Rota Ofídica] URL:',
      MODEL_CONFIG.model1.url
    );

    model1SessionPromise = ort.InferenceSession.create(
      MODEL_CONFIG.model1.url,
      {
        executionProviders: [
          'wasm',
        ],

        graphOptimizationLevel: 'all',
      }
    )
      .then((session) => {
        console.log(
          '[Rota Ofídica] ✓ Modelo 1 carregado'
        );

        console.log(
          '[Rota Ofídica] Inputs:',
          session.inputNames
        );

        console.log(
          '[Rota Ofídica] Outputs:',
          session.outputNames
        );

        return session;
      })
      .catch((error) => {
        // Permite tentar novamente caso a primeira carga falhe.
        model1SessionPromise = null;

        console.error(
          '[Rota Ofídica] Erro ao carregar Modelo 1:',
          error
        );

        throw error;
      });
  }

  return model1SessionPromise;
}


// ============================================================
// CARREGAR MODELO 2
//
// Ainda não vamos usar no teste inicial,
// mas já deixamos preparado.
// ============================================================

export async function loadModel2() {
  if (!model2SessionPromise) {
    console.log(
      '[Rota Ofídica] Carregando Modelo 2...'
    );

    console.log(
      '[Rota Ofídica] URL:',
      MODEL_CONFIG.model2.url
    );

    model2SessionPromise = ort.InferenceSession.create(
      MODEL_CONFIG.model2.url,
      {
        executionProviders: [
          'wasm',
        ],

        graphOptimizationLevel: 'all',
      }
    )
      .then((session) => {
        console.log(
          '[Rota Ofídica] ✓ Modelo 2 carregado'
        );

        return session;
      })
      .catch((error) => {
        model2SessionPromise = null;

        console.error(
          '[Rota Ofídica] Erro ao carregar Modelo 2:',
          error
        );

        throw error;
      });
  }

  return model2SessionPromise;
}


// ============================================================
// INFERÊNCIA — MODELO 1
// ============================================================

export async function runModel1(imageSource) {
  const config = MODEL_CONFIG.model1;

  const startTotal = performance.now();


  // ----------------------------------------------------------
  // 1. Carregar modelo
  // ----------------------------------------------------------

  const session = await loadModel1();


  // ----------------------------------------------------------
  // 2. Pré-processar imagem
  // ----------------------------------------------------------

  const preprocessStart = performance.now();

  const processed = await preprocessImage(
    imageSource
  );

  const preprocessEnd = performance.now();


  // ----------------------------------------------------------
  // 3. Criar Tensor ONNX
  // ----------------------------------------------------------

  const inputTensor = new ort.Tensor(
    'float32',
    processed.data,
    processed.dims
  );


  // ----------------------------------------------------------
  // 4. Inferência
  // ----------------------------------------------------------

  const inferenceStart = performance.now();

  const feeds = {
    [config.inputName]: inputTensor,
  };


  const outputs = await session.run(
    feeds
  );


  const inferenceEnd = performance.now();


  // ----------------------------------------------------------
  // 5. Obter logits
  // ----------------------------------------------------------

  const outputTensor = outputs[
    config.outputName
  ];


  if (!outputTensor) {
    throw new Error(
      `Saída "${config.outputName}" não encontrada. ` +
      `Saídas disponíveis: ${Object.keys(outputs).join(', ')}`
    );
  }


  const logits = Array.from(
    outputTensor.data
  );


  if (logits.length !== 2) {
    throw new Error(
      `Modelo 1 deveria retornar 2 logits, ` +
      `mas retornou ${logits.length}.`
    );
  }


  // ----------------------------------------------------------
  // 6. Softmax
  // ----------------------------------------------------------

  const probabilities = softmax(
    logits
  );


  const pNaoCobra = probabilities[0];
  const pCobra = probabilities[1];


  // ----------------------------------------------------------
  // 7. Threshold operacional
  // ----------------------------------------------------------

  const snakeDetected = (
    pCobra >= config.threshold
  );


  const operationalResult = snakeDetected
    ? 'cobra'
    : 'nao_confirmada';


  const endTotal = performance.now();


  // ----------------------------------------------------------
  // 8. Resultado
  // ----------------------------------------------------------

  const result = {
    model: 'modelo1',

    logits: {
      naoCobra: logits[0],
      cobra: logits[1],
    },

    probabilities: {
      naoCobra: pNaoCobra,
      cobra: pCobra,
    },

    threshold: config.threshold,

    snakeDetected,

    operationalResult,

    timing: {
      preprocessingMs:
        preprocessEnd - preprocessStart,

      inferenceMs:
        inferenceEnd - inferenceStart,

      totalMs:
        endTotal - startTotal,
    },

    preprocessing: processed.debug,
  };


  console.group(
    '[Rota Ofídica] Resultado Modelo 1'
  );

  console.log(
    'P(não cobra):',
    pNaoCobra
  );

  console.log(
    'P(cobra):',
    pCobra
  );

  console.log(
    'Threshold:',
    config.threshold
  );

  console.log(
    'Resultado:',
    operationalResult
  );

  console.log(
    'Tempo:',
    result.timing
  );

  console.log(
    'Pré-processamento:',
    processed.debug
  );

  console.groupEnd();


  return result;
}


// ============================================================
// AGREGAÇÃO OPERACIONAL DO MODELO 2
//
// Já deixamos pronta para o próximo passo.
// ============================================================

export function aggregateModel2Probabilities(
  probabilities
) {
  if (
    !Array.isArray(probabilities)
    ||
    probabilities.length !== 4
  ) {
    throw new Error(
      'Modelo 2 precisa fornecer 4 probabilidades.'
    );
  }


  const [
    pBotropico,
    pCrotalico,
    pElapico,
    pLaquetico,
  ] = probabilities;


  const pBC = (
    pBotropico
    +
    pCrotalico
  );


  const operationalProbabilities = {
    botropicoCrotalico: pBC,
    elapico: pElapico,
    laquetico: pLaquetico,
  };


  const candidates = [
    {
      className: 'botropico_crotalico',
      probability: pBC,
    },

    {
      className: 'elapico',
      probability: pElapico,
    },

    {
      className: 'laquetico',
      probability: pLaquetico,
    },
  ];


  candidates.sort(
    (a, b) =>
      b.probability - a.probability
  );


  const best = candidates[0];


  const accepted = (
    best.probability
    >=
    MODEL_CONFIG.model2.operationalThreshold
  );


  return {
    probabilities: operationalProbabilities,

    bestClass: best.className,

    maxProbability: best.probability,

    threshold:
      MODEL_CONFIG.model2.operationalThreshold,

    accepted,

    operationalResult: accepted
      ? best.className
      : 'inconclusivo',
  };
}

// ============================================================
// INFERÊNCIA — MODELO 2
// ============================================================

export async function runModel2(imageSource) {
  const config = MODEL_CONFIG.model2;

  const startTotal = performance.now();


  // ----------------------------------------------------------
  // 1. Carregar Modelo 2
  // ----------------------------------------------------------

  const session = await loadModel2();


  // ----------------------------------------------------------
  // 2. Pré-processar imagem
  // ----------------------------------------------------------

  const preprocessStart = performance.now();

  const processed = await preprocessImage(
    imageSource
  );

  const preprocessEnd = performance.now();


  // ----------------------------------------------------------
  // 3. Criar Tensor
  // ----------------------------------------------------------

  const inputTensor = new ort.Tensor(
    'float32',
    processed.data,
    processed.dims
  );


  // ----------------------------------------------------------
  // 4. Inferência
  // ----------------------------------------------------------

  const inferenceStart = performance.now();

  const feeds = {
    [config.inputName]: inputTensor,
  };

  const outputs = await session.run(
    feeds
  );

  const inferenceEnd = performance.now();


  // ----------------------------------------------------------
  // 5. Obter logits
  // ----------------------------------------------------------

  const outputTensor = outputs[
    config.outputName
  ];


  if (!outputTensor) {
    throw new Error(
      `Saída "${config.outputName}" não encontrada. ` +
      `Saídas disponíveis: ${Object.keys(outputs).join(', ')}`
    );
  }


  const logits = Array.from(
    outputTensor.data
  );


  if (logits.length !== 4) {
    throw new Error(
      `Modelo 2 deveria retornar 4 logits, ` +
      `mas retornou ${logits.length}.`
    );
  }


  // ----------------------------------------------------------
  // 6. Softmax
  // ----------------------------------------------------------

  const probabilities = softmax(
    logits
  );


  const [
    pBotropico,
    pCrotalico,
    pElapico,
    pLaquetico,
  ] = probabilities;


  // ----------------------------------------------------------
  // 7. Regra operacional BC / E / L
  // ----------------------------------------------------------

  const aggregated = aggregateModel2Probabilities(
    probabilities
  );


  const endTotal = performance.now();


  // ----------------------------------------------------------
  // 8. Resultado
  // ----------------------------------------------------------

  const result = {
    model: 'modelo2',

    logits: {
      botropico: logits[0],
      crotalico: logits[1],
      elapico: logits[2],
      laquetico: logits[3],
    },

    probabilities: {
      botropico: pBotropico,
      crotalico: pCrotalico,
      elapico: pElapico,
      laquetico: pLaquetico,
    },

    operational: aggregated,

    timing: {
      preprocessingMs:
        preprocessEnd - preprocessStart,

      inferenceMs:
        inferenceEnd - inferenceStart,

      totalMs:
        endTotal - startTotal,
    },

    preprocessing: processed.debug,
  };


  console.group(
    '[Rota Ofídica] Resultado Modelo 2'
  );

  console.log(
    'P(botrópico):',
    pBotropico
  );

  console.log(
    'P(crotálico):',
    pCrotalico
  );

  console.log(
    'P(elapídico):',
    pElapico
  );

  console.log(
    'P(laquético):',
    pLaquetico
  );

  console.log(
    'P(BC):',
    aggregated
      .probabilities
      .botropicoCrotalico
  );

  console.log(
    'Threshold operacional:',
    aggregated.threshold
  );

  console.log(
    'Resultado operacional:',
    aggregated.operationalResult
  );

  console.log(
    'Tempo:',
    result.timing
  );

  console.groupEnd();


  return result;
}