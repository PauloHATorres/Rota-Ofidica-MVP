import { Routes, Route, Navigate } from 'react-router-dom';

import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';

import Inicio from './pages/Inicio';
import Centros from './pages/Centros';
import Informacoes from './pages/Informacoes';
import Sobre from './pages/Sobre';

import Model1Debug from './ai/Model1Debug';


export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Inicio />}
          />

          <Route
            path="/centros"
            element={<Centros />}
          />

          <Route
            path="/informacoes"
            element={<Informacoes />}
          />

          <Route
            path="/sobre"
            element={<Sobre />}
          />

          {/* ROTA TEMPORÁRIA PARA TESTE DA IA */}
          <Route
            path="/debug-ia"
            element={<Model1Debug />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}