import { NavLink } from 'react-router-dom';

export default function AppHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="brand">Rota Ofídica</NavLink>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/centros">Centros</NavLink>
          <NavLink to="/informacoes">Informações</NavLink>
          <NavLink to="/sobre">Sobre</NavLink>
        </nav>
      </div>
    </header>
  );
}
