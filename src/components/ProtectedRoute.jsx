import { Navigate, useLocation } from 'react-router';
import { useAutenticacao } from '../hooks/useAutenticacao.js';

export default function RotaProtegida({ children }) {
  const { carregando, autorizado } = useAutenticacao();
  const localizacao = useLocation();

  if (carregando) {
    return (
      <div className="container page section">
        <p className="muted">Verificando acesso ao painel…</p>
      </div>
    );
  }

  if (!autorizado) {
    return <Navigate to="/painel" replace state={{ from: localizacao.pathname }} />;
  }

  return children;
}
