import { useState } from 'react';

import {
  runModel1,
  runModel2,
} from './inference';


function percent(value) {
  return (
    value * 100
  ).toFixed(2);
}


export default function Model1Debug() {
  const [
    imageUrl,
    setImageUrl
  ] = useState(null);

  const [
    model1Result,
    setModel1Result
  ] = useState(null);

  const [
    model2Result,
    setModel2Result
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    stage,
    setStage
  ] = useState('');

  const [
    error,
    setError
  ] = useState(null);


  async function handleFile(event) {
    const file = (
      event.target.files?.[0]
    );


    if (!file) {
      return;
    }


    setModel1Result(null);
    setModel2Result(null);
    setError(null);


    if (imageUrl) {
      URL.revokeObjectURL(
        imageUrl
      );
    }


    const preview = (
      URL.createObjectURL(file)
    );

    setImageUrl(
      preview
    );


    try {
      setLoading(true);


      // ======================================================
      // MODELO 1
      // ======================================================

      setStage(
        'Executando Modelo 1...'
      );


      const result1 = await runModel1(
        file
      );


      setModel1Result(
        result1
      );


      // ======================================================
      // MODELO 2
      //
      // Só executa se o Modelo 1 passar pelo threshold.
      // ======================================================

      if (
        result1.snakeDetected
      ) {
        setStage(
          'Executando Modelo 2...'
        );


        const result2 = await runModel2(
          file
        );


        setModel2Result(
          result2
        );
      }


      setStage(
        'Análise concluída.'
      );


    } catch (err) {

      console.error(
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );


      setStage(
        ''
      );


    } finally {

      setLoading(false);
    }
  }


  return (
    <div
      style={{
        padding: 24,
        maxWidth: 650,
        margin: '0 auto',
      }}
    >

      <h2>
        Debug — Pipeline IA
      </h2>


      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
      />


      {imageUrl && (
        <div
          style={{
            marginTop: 20,
          }}
        >
          <img
            src={imageUrl}
            alt="Imagem em análise"
            style={{
              maxWidth: '100%',
              maxHeight: 400,
              borderRadius: 12,
            }}
          />
        </div>
      )}


      {loading && (
        <p>
          <strong>
            {stage}
          </strong>
        </p>
      )}


      {error && (
        <pre
          style={{
            color: 'red',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error}
        </pre>
      )}


      {/* =================================================== */}
      {/* MODELO 1                                            */}
      {/* =================================================== */}

      {model1Result && (
        <div
          style={{
            marginTop: 24,
            padding: 18,
            border: '1px solid #ddd',
            borderRadius: 12,
          }}
        >

          <h3>
            Modelo 1 — Cobra
          </h3>


          <p>
            P(cobra):{' '}
            <strong>
              {
                percent(
                  model1Result
                    .probabilities
                    .cobra
                )
              }%
            </strong>
          </p>


          <p>
            P(não cobra):{' '}
            {
              percent(
                model1Result
                  .probabilities
                  .naoCobra
              )
            }%
          </p>


          <p>
            Threshold: {
              model1Result.threshold
            }
          </p>


          <p>
            Resultado:{' '}
            <strong>
              {
                model1Result
                  .operationalResult
              }
            </strong>
          </p>


          <p>
            Inferência:{' '}
            {
              model1Result
                .timing
                .inferenceMs
                .toFixed(1)
            } ms
          </p>

        </div>
      )}


      {/* =================================================== */}
      {/* MODELO 2                                            */}
      {/* =================================================== */}

      {model2Result && (
        <div
          style={{
            marginTop: 24,
            padding: 18,
            border: '1px solid #ddd',
            borderRadius: 12,
          }}
        >

          <h3>
            Modelo 2 — Grupo ofídico
          </h3>


          <h4>
            Saída original
          </h4>


          <p>
            Botrópico:{' '}
            {
              percent(
                model2Result
                  .probabilities
                  .botropico
              )
            }%
          </p>


          <p>
            Crotálico:{' '}
            {
              percent(
                model2Result
                  .probabilities
                  .crotalico
              )
            }%
          </p>


          <p>
            Elapídico:{' '}
            {
              percent(
                model2Result
                  .probabilities
                  .elapico
              )
            }%
          </p>


          <p>
            Laquético:{' '}
            {
              percent(
                model2Result
                  .probabilities
                  .laquetico
              )
            }%
          </p>


          <hr />


          <h4>
            Saída operacional
          </h4>


          <p>
            Botrópico/Crotálico:{' '}
            <strong>
              {
                percent(
                  model2Result
                    .operational
                    .probabilities
                    .botropicoCrotalico
                )
              }%
            </strong>
          </p>


          <p>
            Elapídico:{' '}
            {
              percent(
                model2Result
                  .operational
                  .probabilities
                  .elapico
              )
            }%
          </p>


          <p>
            Laquético:{' '}
            {
              percent(
                model2Result
                  .operational
                  .probabilities
                  .laquetico
              )
            }%
          </p>


          <p>
            Threshold operacional:{' '}
            {
              model2Result
                .operational
                .threshold
            }
          </p>


          <p>
            Resultado final:{' '}

            <strong>
              {
                model2Result
                  .operational
                  .operationalResult
              }
            </strong>
          </p>


          <p>
            Inferência:{' '}
            {
              model2Result
                .timing
                .inferenceMs
                .toFixed(1)
            } ms
          </p>

        </div>
      )}


      {/* =================================================== */}
      {/* MODELO 1 NÃO PASSOU                                */}
      {/* =================================================== */}

      {
        model1Result
        &&
        !model1Result.snakeDetected
        &&
        (
          <div
            style={{
              marginTop: 24,
              padding: 18,
              border: '1px solid #ddd',
              borderRadius: 12,
            }}
          >

            <strong>
              Modelo 2 não executado.
            </strong>

            <p>
              O Modelo 1 não confirmou cobra
              com o threshold operacional.
            </p>

          </div>
        )
      }

    </div>
  );
}