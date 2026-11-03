import { Navigate, Route, Routes } from 'react-router';
import ProvedorAutenticacao from '../../components/AuthProvider.jsx';
import RotaProtegida from '../../components/ProtectedRoute.jsx';
import PaginaPainel from './DashboardPage.jsx';
import PaginaLogin from './LoginPage.jsx';

export default function AreaAdministrativa() {
  return (
    <ProvedorAutenticacao>
      <Routes>
        <Route path="" element={<PaginaLogin />} />
        <Route
          path="dashboard"
          element={
            <RotaProtegida>
              <PaginaPainel />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Routes>
    </ProvedorAutenticacao>
  );
}
