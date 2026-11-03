import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAutenticacao } from '../../hooks/useAutenticacao.js';
import {
  alterarProjetoDestacado,
  carregarMensagens,
  carregarProjetosDestacados,
} from '../../services/dashboard.js';
import { encerrarSessao } from '../../services/supabase.js';

function formatarData(valor) {
  if (!valor) return '—';

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(data);
}

export default function PaginaPainel() {
  const { recarregar } = useAutenticacao();
  const navegar = useNavigate();
  const [mensagens, definirMensagens] = useState([]);
  const [destacados, definirDestacados] = useState([]);
  const [nomeRepositorio, definirNomeRepositorio] = useState('');
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');
  const [enviando, definirEnviando] = useState(false);

  const carregarDados = useCallback(async () => {
    definirCarregando(true);
    definirErro('');

    try {
      const [listaMensagens, listaDestacados] = await Promise.all([
        carregarMensagens(),
        carregarProjetosDestacados(),
      ]);

      definirMensagens(listaMensagens);
      definirDestacados(listaDestacados);
    } catch (erroCarregamento) {
      definirErro(erroCarregamento.message || 'Não foi possível carregar o painel.');
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  async function salvarRepositorio() {
    const nome = nomeRepositorio.trim();

    if (!nome) {
      definirErro('Informe o nome do repositório a ser exibido no destaque.');
      return;
    }

    definirEnviando(true);
    definirErro('');

    try {
      await alterarProjetoDestacado(nome, true);
      definirNomeRepositorio('');
      await carregarDados();
    } catch (erroSalvar) {
      definirErro(erroSalvar.message || 'Não foi possível atualizar a lista de destaques.');
    } finally {
      definirEnviando(false);
    }
  }

  async function removerRepositorio(repoNome) {
    definirEnviando(true);
    definirErro('');

    try {
      await alterarProjetoDestacado(repoNome, false);
      await carregarDados();
    } catch (erroRemocao) {
      definirErro(erroRemocao.message || 'Não foi possível remover o destaque.');
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

  return (
    <div className="container page section panel-page">
      <div className="panel-header">
        <div>
          <p className="eyebrow">PAINEL / DASHBOARD</p>
          <h1>Gerenciar portfólio</h1>
        </div>
        <button className="button button-ghost" type="button" onClick={sair}>
          Sair
        </button>
      </div>

      <div className="panel-grid">
        <section className="panel-card">
          <h2>Mensagens recebidas</h2>
          {carregando ? (
            <p className="muted">Carregando mensagens…</p>
          ) : erro ? (
            <p className="panel-error">{erro}</p>
          ) : mensagens.length ? (
            <ul className="panel-list">
              {mensagens.map((mensagem) => (
                <li key={mensagem.id}>
                  <div>
                    <strong>{mensagem.nome || 'Remetente sem nome'}</strong>
                    <span>{mensagem.email || 'E-mail não informado'}</span>
                  </div>
                  <small>{formatarData(mensagem.created_at)}</small>
                  <p>{mensagem.mensagem || 'Mensagem sem conteúdo.'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nenhuma mensagem foi recebida até o momento.</p>
          )}
        </section>

        <aside className="panel-card">
          <h2>Projetos em destaque</h2>
          <div className="panel-feature-form">
            <input
              type="text"
              value={nomeRepositorio}
              onChange={(evento) => definirNomeRepositorio(evento.target.value)}
              placeholder="nome-do-repositorio"
            />
            <button
              className="button"
              type="button"
              onClick={salvarRepositorio}
              disabled={enviando}
            >
              {enviando ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>

          {destacados.length ? (
            <ul className="tag-list">
              {destacados.map((item) => (
                <li key={item.id ?? item.repo_name}>
                  <span>{item.repo_name}</span>
                  <button type="button" onClick={() => removerRepositorio(item.repo_name)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nenhum projeto em destaque.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
