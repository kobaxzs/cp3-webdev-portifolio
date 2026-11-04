import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAutenticacao } from '../../hooks/useAutenticacao.js';
import { entrarNaConta, encerrarSessao } from '../../services/supabase.js';

export default function PaginaLogin() {
  const { autorizado, carregando, usuario, recarregar } = useAutenticacao();
  const navegar = useNavigate();
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [erro, definirErro] = useState('');
  const [enviando, definirEnviando] = useState(false);

  if (carregando) {
    return (
      <div className="container page section">
        <p className="muted">Verificando autenticação…</p>
      </div>
    );
  }

  if (autorizado) {
    return <Navigate to="/painel/dashboard" replace />;
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro('');
    definirEnviando(true);

    try {
      await entrarNaConta(email.trim(), senha);
      await recarregar();
      navegar('/painel/dashboard');
    } catch (erroLogin) {
      definirErro(erroLogin.message || 'Não foi possível entrar no painel.');
    } finally {
      definirEnviando(false);
    }
  }

  async function sair() {
    try {
      await encerrarSessao();
      await recarregar();
      navegar('/painel');
    } catch (erroSaida) {
      definirErro(erroSaida.message || 'Não foi possível encerrar a sessão.');
    }
  }

  if (usuario && !autorizado) {
    return (
      <div className="container page section panel-page">
        <div className="panel-card panel-wide">
          <p className="eyebrow">PAINEL / ACESSO</p>
          <h1>Conta autenticada, mas sem autorização.</h1>
          <p className="muted">
            A sessão existe, porém o perfil atual não está cadastrado em{' '}
            <strong>portfolio_owners</strong>.
          </p>
          <button className="button" type="button" onClick={sair}>
            Encerrar sessão
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page section panel-page panel-page-login">
      <div className="panel-card panel-login">
        <p className="eyebrow">PAINEL / LOGIN</p>
        <h1>Entrar no painel</h1>
        <p className="muted">Apenas o proprietário tem acesso a esta área</p>

        <form className="panel-form" onSubmit={enviarFormulario}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(evento) => definirEmail(evento.target.value)}
              placeholder="seu-email@exemplo.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(evento) => definirSenha(evento.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {erro ? <p className="panel-error">{erro}</p> : null}

          <button className="button" type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
