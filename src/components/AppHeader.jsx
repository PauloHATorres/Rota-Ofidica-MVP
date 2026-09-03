import { NavLink } from 'react-router-dom';
import './AppHeader.css';

export default function AppHeader() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <header className="rota-header">
      <div className="rota-header-inner">

        {/* =================================================
            MOBILE
           ================================================= */}

        <div className="rota-header-mobile">

          <div className="rota-header-mobile-side rota-header-mobile-left">
            <img
              src={`${baseUrl}images/logonovofmvz.png`}
              alt="FMVZ Unesp"
              className="rota-header-fmvz-mobile"
            />
          </div>


          <NavLink
            to="/"
            className="rota-header-main-brand"
            aria-label="Rota Ofídica - Página inicial"
          >
            <img
              src={`${baseUrl}images/Rota-ofidica-escrito.png`}
              alt="Rota Ofídica"
              className="rota-header-rota-mobile"
            />
          </NavLink>


          <div className="rota-header-mobile-side rota-header-mobile-right">
            <img
              src={`${baseUrl}images/Design sem nome (1).png`}
              alt="Grupo 11 SINTA"
              className="rota-header-sinta-mobile"
            />
          </div>

        </div>


        {/* =================================================
            DESKTOP
           ================================================= */}

        <div className="rota-header-desktop">

          <div className="rota-header-desktop-brands">

            <img
              src={`${baseUrl}images/logonovofmvz.png`}
              alt="FMVZ Unesp"
              className="rota-header-fmvz-desktop"
            />


            <div className="rota-header-divider" />


            <NavLink
              to="/"
              className="rota-header-rota-link"
              aria-label="Rota Ofídica - Página inicial"
            >
              <img
                src={`${baseUrl}images/Rota-ofidica-escrito.png`}
                alt="Rota Ofídica"
                className="rota-header-rota-desktop"
              />
            </NavLink>


            <div className="rota-header-divider" />


            <img
              src={`${baseUrl}images/Design sem nome (1).png`}
              alt="Grupo 11 SINTA"
              className="rota-header-sinta-desktop"
            />

          </div>


          <nav
            className="rota-header-nav"
            aria-label="Navegação principal"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'rota-header-nav-link active'
                  : 'rota-header-nav-link'
              }
            >
              Início
            </NavLink>

            <NavLink
              to="/centros"
              className={({ isActive }) =>
                isActive
                  ? 'rota-header-nav-link active'
                  : 'rota-header-nav-link'
              }
            >
              Centros
            </NavLink>

            <NavLink
              to="/informacoes"
              className={({ isActive }) =>
                isActive
                  ? 'rota-header-nav-link active'
                  : 'rota-header-nav-link'
              }
            >
              Informações
            </NavLink>

            <NavLink
              to="/sobre"
              className={({ isActive }) =>
                isActive
                  ? 'rota-header-nav-link active'
                  : 'rota-header-nav-link'
              }
            >
              Sobre
            </NavLink>
          </nav>

        </div>

      </div>
    </header>
  );
}