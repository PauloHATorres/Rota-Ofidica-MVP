import { NavLink } from 'react-router-dom';

import {
  House,
  MapPin,
  Info,
  UserCircle
} from '@phosphor-icons/react';


const items = [
  {
    to: '/',
    label: 'Início',
    icon: House,
    end: true
  },
  {
    to: '/centros',
    label: 'Centros',
    icon: MapPin
  },
  {
    to: '/informacoes',
    label: 'Informações',
    icon: Info
  },
  {
    to: '/sobre',
    label: 'Sobre',
    icon: UserCircle
  }
];


export default function BottomNav() {
  return (
    <>
      <nav
        className="sinta-bottom-nav"
        aria-label="Navegação principal"
      >
        {items.map(
          ({
            to,
            label,
            icon: Icon,
            end
          }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'sinta-bottom-nav-item active'
                  : 'sinta-bottom-nav-item'
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={25}
                    weight={
                      isActive
                        ? 'fill'
                        : 'duotone'
                    }
                  />

                  <span>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          )
        )}
      </nav>


      <style>
        {`
          .sinta-bottom-nav {
            position: fixed;

            left: 0;
            right: 0;
            bottom: 0;

            z-index: 999999;

            width: 100%;
            height: 76px;

            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));

            align-items: center;

            padding:
              4px
              8px
              calc(4px + env(safe-area-inset-bottom));

            background: rgba(255, 255, 255, 0.98);

            border-top: 1px solid #E4E8E5;

            box-shadow:
              0 -6px 24px
              rgba(20, 55, 40, 0.08);

            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
          }


          .sinta-bottom-nav-item {
            position: relative;

            height: 68px;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 4px;

            color: #747D78;

            font-size: 11px;
            font-weight: 500;

            text-decoration: none;

            -webkit-tap-highlight-color: transparent;
          }


          .sinta-bottom-nav-item.active {
            color: #178A57;

            font-weight: 700;
          }


          .sinta-bottom-nav-item.active::before {
            content: "";

            position: absolute;

            top: 0;
            left: 50%;

            width: 38px;
            height: 3px;

            transform: translateX(-50%);

            border-radius: 999px;

            background: #178A57;
          }


          /*
            Desktop REAL:
            tela larga + dispositivo com mouse.
            
            Não usamos JavaScript,
            portanto não existe mais risco
            de aparecer e depois sumir.
          */

          @media
            (min-width: 1024px)
            and (hover: hover)
            and (pointer: fine) {

            .sinta-bottom-nav {
              display: none !important;
            }
          }
        `}
      </style>
    </>
  );
}