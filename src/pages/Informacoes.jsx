import {
  CheckCircle,
  FirstAidKit,
  PhoneCall,
  Siren,
  WarningCircle,
  XCircle,
  FireTruckIcon
} from '@phosphor-icons/react';


const whatToDo = [
  'Lave o local da picada apenas com água e sabão.',
  'Se possível, tire uma foto do animal que picou a vítima, mantendo distância segura.',
  'Leve a vítima ao serviço de saúde responsável, seja atendimento humano ou veterinário.',
  'Mantenha a vítima o mais parada possível.'
];


const whatNotToDo = [
  'Não faça torniquete ou garrote, como amarração dos membros.',
  'Não compre nem tente aplicar o soro sozinho.',
  'Não tente sugar o veneno.',
  'Não passe nenhum produto no local da picada.'
];


export default function Informacoes() {
  return (
    <div className="info-page">

      {/* CABEÇALHO */}

      <section className="info-heading">

        <h1 className="page-title">
          Primeiros socorros
        </h1>

        <p className="page-subtitle">
          Saiba como agir em caso de acidente envolvendo serpentes.
        </p>

      </section>


      {/* EMERGÊNCIA */}

      <section className="emergency-section">

        <h2 className="section-title">
          Emergência
        </h2>


        <div className="emergency-grid">


          {/* SAMU */}

          <article
            className="
              emergency-card
              emergency-card-samu
            "
          >

            <div className="emergency-card-icon">

              <FirstAidKit
                size={32}
                weight="duotone"
              />

            </div>


            <span className="emergency-label">
              SAMU
            </span>


            <strong className="emergency-number">
              192
            </strong>


            <a
              className="emergency-call-button"
              href="tel:192"
            >

              <PhoneCall
                size={19}
                weight="fill"
              />

              Ligar

            </a>

          </article>


          {/* BOMBEIROS */}

          <article
            className="
              emergency-card
              emergency-card-fire
            "
          >

            <div className="emergency-card-icon">

              <FireTruckIcon
                size={34}
                weight="duotone"
              />

            </div>


            <span className="emergency-label">
              Bombeiros
            </span>


            <strong className="emergency-number">
              193
            </strong>


            <a
              className="emergency-call-button"
              href="tel:193"
            >

              <PhoneCall
                size={19}
                weight="fill"
              />

              Ligar

            </a>

          </article>

        </div>

      </section>


      {/* O QUE FAZER */}

      <section
        className="
          info-checklist-card
          info-checklist-positive
        "
      >

        <div className="info-checklist-header">

          <div>

            <span className="info-eyebrow">
              Condutas recomendadas
            </span>

            <h2>
              O que fazer
            </h2>

          </div>


          <div
            className="
              info-status-icon
              info-status-icon-positive
            "
          >

            <CheckCircle
              size={27}
              weight="duotone"
            />

          </div>

        </div>


        <div className="info-checklist">

          {whatToDo.map((item) => (

            <div
              key={item}
              className="info-checklist-item"
            >

              <span
                className="
                  info-check-icon-phosphor
                  info-check-icon-positive-phosphor
                "
              >

                <CheckCircle
                  size={24}
                  weight="fill"
                />

              </span>


              <p>
                {item}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* O QUE NÃO FAZER */}

      <section
        className="
          info-checklist-card
          info-checklist-negative
        "
      >

        <div className="info-checklist-header">

          <div>

            <span className="info-eyebrow">
              Condutas que devem ser evitadas
            </span>

            <h2>
              O que não fazer
            </h2>

          </div>


          <div
            className="
              info-status-icon
              info-status-icon-negative
            "
          >

            <XCircle
              size={27}
              weight="duotone"
            />

          </div>

        </div>


        <div className="info-checklist">

          {whatNotToDo.map((item) => (

            <div
              key={item}
              className="info-checklist-item"
            >

              <span
                className="
                  info-check-icon-phosphor
                  info-check-icon-negative-phosphor
                "
              >

                <XCircle
                  size={24}
                  weight="fill"
                />

              </span>


              <p>
                {item}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* AVISO */}

      <section className="info-final-warning">

        <WarningCircle
          size={25}
          weight="duotone"
        />


        <div>

          <strong>
            Procure atendimento imediatamente.
          </strong>


          <p>
            A imagem ajuda na triagem, mas não substitui avaliação médica.
            Em caso de sintomas ou mordida suspeita, procure atendimento
            imediatamente.
          </p>

        </div>

      </section>

    </div>
  );
}