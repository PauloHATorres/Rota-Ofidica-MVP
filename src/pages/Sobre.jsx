import {
  ArrowRight,
  BookOpen,
  Camera,
  FirstAidKit,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkle,
  UsersThree,
  WarningCircle
} from '@phosphor-icons/react';

import '../styles/sobre.css';


const studyTopics = [
  'Identificação de serpentes',
  'Acidentes ofídicos',
  'Primeiros socorros',
  'Soroterapia',
  'Dados de Botucatu',
  'Educação em saúde'
];


const teamMembers = [
  'Amanda Manara',
  'Antonio L. Sforcin Amaral',
  'Davi Scarpelli',
  'Fernanda Sola',
  'Gabriel Alarcon',
  'Henrique Cabral',
  'João Pedro Marmol',
  'Juliana Mayumi',
  'Landa Munhoz',
  'Louise Ruffo',
  'Luana Cogo',
  'Lucas Leoni',
  'Luiza Dias',
  'Luiza Sayuri',
  'Maisa Aguiar',
  'Marco Antônio Queiroz',
  'Maria Fernanda Moysés',
  'Maria Heloísa Mondeque',
  'Marina Trindade',
  'Natasha Mellody',
  'Nathalia Tiemi',
  'Paulo Henrique Torres',
  'Sophia de Souza',
  'Vitória Bertoluci'
];


export default function Sobre() {
  return (
    <div className="rota-about">

      {/* ===================================================
          HERO
         =================================================== */}

      <section className="rota-about-hero">

        <div className="rota-about-hero-content">

          <div className="rota-about-badge">
            <GraduationCap
              size={18}
              weight="duotone"
            />

            XVIII SINTA 2026 · Saúde Única
          </div>


          <h1>
            Sobre o <span>Rota Ofídica</span>
          </h1>


          <p>
            Um MVP acadêmico criado para aproximar informação,
            triagem inicial e acesso ao atendimento em situações
            envolvendo serpentes.
          </p>

        </div>


        <div className="rota-about-hero-icon">
          <ShieldCheck
            size={58}
            weight="duotone"
          />
        </div>

      </section>


      {/* ===================================================
          SINTA
         =================================================== */}

      <section className="rota-about-context">

        <div className="rota-about-section-label">
          Contexto acadêmico
        </div>


        <div className="rota-about-context-grid">

          <article className="rota-about-feature-card">

            <div className="rota-about-feature-icon">
              <GraduationCap
                size={30}
                weight="duotone"
              />
            </div>


            <div>
              <h2>
                O que é a SINTA?
              </h2>

              <p>
                A Semana de Integração Acadêmica é um componente
                curricular de extensão universitária do curso de
                Medicina Veterinária da FMVZ-Unesp, câmpus de Botucatu.
              </p>

              <p>
                A iniciativa aproxima os estudantes de questões da
                realidade social e estimula a aplicação prática do
                conhecimento e o trabalho em equipe.
              </p>
            </div>

          </article>


          <article className="rota-about-group-card">

            <span className="rota-about-group-number">
              GRUPO 11
            </span>

            <h2>
              Os efeitos e consequências dos ataques ofídicos
            </h2>

            <p>
              em animais e humanos na região de Botucatu
            </p>


            <div className="rota-about-professors">

              <span>
                Professores responsáveis
              </span>

              <strong>
                Prof. Dr. Wanderson Adriano Biscola Pereira
              </strong>

              <strong>
                Prof. Dr. José Paes de Oliveira Filho
              </strong>

            </div>

          </article>

        </div>

      </section>


      {/* ===================================================
          PRIMEIRA ETAPA
         =================================================== */}

      <section className="rota-about-study">

        <div className="rota-about-section-heading">

          <div>

            <span className="rota-about-section-label">
              Primeira etapa
            </span>

            <h2>
              Antes da solução, estudamos o problema
            </h2>

          </div>


          <BookOpen
            size={34}
            weight="duotone"
          />

        </div>


        <p className="rota-about-section-description">
          O desenvolvimento do projeto começou pelo estudo dos
          acidentes ofídicos e das diferentes dimensões envolvidas
          nesse problema, combinando conhecimento técnico, levantamento
          de dados e atividades de extensão.
        </p>


        <div className="rota-about-topic-list">

          {studyTopics.map((topic) => (
            <span
              key={topic}
              className="rota-about-topic"
            >
              {topic}
            </span>
          ))}

        </div>


        <div className="rota-about-study-note">

          <Sparkle
            size={22}
            weight="duotone"
          />

          <p>
            Essa etapa também incluiu atividades como visita ao CEVAP,
            discussão clínica com profissional do HCFMB, levantamento
            de dados e desenvolvimento de material educativo.
          </p>

        </div>

      </section>


      {/* ===================================================
          DESAFIO
         =================================================== */}

      <section className="rota-about-problem">

        <div className="rota-about-problem-icon">

          <WarningCircle
            size={34}
            weight="duotone"
          />

        </div>


        <div>

          <span className="rota-about-section-label">
            O desafio
          </span>

          <h2>
            Informação existe. O difícil é acessá-la no momento certo.
          </h2>

          <p>
            Diante de uma serpente ou de um possível acidente ofídico,
            uma pessoa sem treinamento pode ter dificuldade para
            reconhecer o risco envolvido e descobrir rapidamente onde
            buscar atendimento adequado.
          </p>

          <p>
            Além disso, diferentes acidentes podem demandar diferentes
            soros e nem todas as unidades de atendimento possuem os
            mesmos recursos.
          </p>

        </div>

      </section>


      {/* ===================================================
          TRANSIÇÃO
         =================================================== */}

      <div className="rota-about-transition">

        <span>
          Do problema à proposta
        </span>

        <ArrowRight
          size={22}
          weight="bold"
        />

      </div>


      {/* ===================================================
          SOLUÇÃO
         =================================================== */}

      <section className="rota-about-solution">

        <div className="rota-about-solution-top">

          <div>

            <span className="rota-about-section-label">
              Nossa proposta
            </span>

            <h2>
              Rota Ofídica
            </h2>

          </div>


          <div className="rota-about-solution-logo">
            <ShieldCheck
              size={38}
              weight="duotone"
            />
          </div>

        </div>


        <p>
          O Rota Ofídica surge como um desdobramento das atividades
          do Grupo 11 e materializa, em formato digital, a proposta de
          desenvolver uma ferramenta de identificação e avaliação
          inicial de risco em situações envolvendo serpentes.
        </p>


        <p>
          O webapp busca reunir análise de imagem, informações de
          primeiros socorros e localização de centros de atendimento
          em uma única experiência.
        </p>

      </section>


      {/* ===================================================
          FLUXO DO APP
         =================================================== */}

      <section className="rota-about-flow">

        <div className="rota-about-section-heading">

          <div>

            <span className="rota-about-section-label">
              Na prática
            </span>

            <h2>
              Como funciona
            </h2>

          </div>

        </div>


        <div className="rota-about-flow-grid">

          <article className="rota-about-flow-card">

            <div className="rota-about-flow-number">
              01
            </div>

            <div className="rota-about-flow-icon">
              <Camera
                size={30}
                weight="duotone"
              />
            </div>

            <h3>
              Registro
            </h3>

            <p>
              O usuário tira ou envia uma foto da serpente.
            </p>

          </article>


          <article className="rota-about-flow-card">

            <div className="rota-about-flow-number">
              02
            </div>

            <div className="rota-about-flow-icon">
              <ShieldCheck
                size={30}
                weight="duotone"
              />
            </div>

            <h3>
              Avaliação inicial
            </h3>

            <p>
              O sistema analisa a imagem para apoiar uma
              avaliação preliminar do risco.
            </p>

          </article>


          <article className="rota-about-flow-card">

            <div className="rota-about-flow-number">
              03
            </div>

            <div className="rota-about-flow-icon">
              <FirstAidKit
                size={30}
                weight="duotone"
              />
            </div>

            <h3>
              Orientação
            </h3>

            <p>
              São apresentadas informações importantes sobre
              as primeiras condutas.
            </p>

          </article>


          <article className="rota-about-flow-card">

            <div className="rota-about-flow-number">
              04
            </div>

            <div className="rota-about-flow-icon">
              <MapPin
                size={30}
                weight="duotone"
              />
            </div>

            <h3>
              Encaminhamento
            </h3>

            <p>
              O usuário pode localizar unidades de atendimento
              compatíveis com a situação.
            </p>

          </article>

        </div>

      </section>


      {/* ===================================================
          MVP
         =================================================== */}

      <section className="rota-about-mvp">

        <div className="rota-about-mvp-marker">
          MVP
        </div>


        <div>

          <span className="rota-about-section-label">
            Produto mínimo viável
          </span>

          <h2>
            O que estamos apresentando?
          </h2>

          <p>
            Esta versão do Rota Ofídica foi desenvolvida como um
            Produto Mínimo Viável para demonstrar a integração entre
            análise de imagem, orientação inicial e localização de
            centros de atendimento.
          </p>

          <p>
            O objetivo desta etapa é testar a viabilidade do fluxo e
            da proposta, e não apresentar um sistema clínico definitivo.
          </p>

        </div>

      </section>


      {/* ===================================================
          EQUIPE
         =================================================== */}

      <section className="rota-about-team">

        <div className="rota-about-section-heading">

          <div>

            <span className="rota-about-section-label">
              Grupo 11
            </span>

            <h2>
              Equipe do projeto
            </h2>

          </div>


          <UsersThree
            size={35}
            weight="duotone"
          />

        </div>


        <div className="rota-about-team-card">

          <h3>
            Discentes de Graduação e Pós-Graduação
          </h3>


          <div className="rota-about-names">

            {teamMembers.map((name) => (
              <span key={name}>
                {name}
              </span>
            ))}

          </div>


          <div className="rota-about-team-divider" />


          <div className="rota-about-team-professors">

            <span>
              Professores responsáveis
            </span>

            <strong>
              Prof. Dr. Wanderson Adriano Biscola Pereira
            </strong>

            <strong>
              Prof. Dr. José Paes de Oliveira Filho
            </strong>

          </div>


          <div className="rota-about-team-divider" />


          <div className="rota-about-team-professors">

            <span>
              Colaboradores
            </span>

            <strong>
              Prof. Dr. Daniel Sá Freire Lamarca — FCA/UNESP, Botucatu
            </strong>

          </div>

        </div>

      </section>


      {/* ===================================================
          LIMITAÇÃO
         =================================================== */}

      <section className="rota-about-warning">

        <WarningCircle
          size={27}
          weight="duotone"
        />


        <div>

          <strong>
            Ferramenta de apoio
          </strong>

          <p>
            O Rota Ofídica é um MVP experimental de apoio à triagem.
            Seus resultados não constituem diagnóstico e não substituem
            avaliação profissional ou identificação taxonômica realizada
            por especialista.
          </p>

        </div>

      </section>

    </div>
  );
}
