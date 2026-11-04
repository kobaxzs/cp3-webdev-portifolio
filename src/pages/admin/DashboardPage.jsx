import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { EstadoCarregamento, EstadoErro, EstadoVazio } from '../../components/Feedback.jsx';
import Icon from '../../components/Icon.jsx';
import { useAutenticacao } from '../../hooks/useAutenticacao.js';
import {
  alterarProjetoDestacado,
  carregarMensagens,
  carregarProjetosDestacados,
  marcarMensagemRespondida,
} from '../../services/dashboard.js';
import { obterRepositorios } from '../../services/github.js';
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
  const { usuario, recarregar } = useAutenticacao();
  const navegar = useNavigate();
  const [mensagens, definirMensagens] = useState([]);
  const [destacados, definirDestacados] = useState([]);
  const [repositorios, definirRepositorios] = useState([]);
  const [aba, definirAba] = useState('messages');
  const [filtro, definirFiltro] = useState('all');
  const [carregando, definirCarregando] = useState(true);
  const [salvando, definirSalvando] = useState('');
  const [erro, definirErro] = useState('');
  const [retorno, definirRetorno] = useState('');

  const carregarDados = useCallback(async () => {
    definirCarregando(true);
    definirErro('');

    try {
      const [listaMensagens, listaDestacados, listaRepositorios] = await Promise.all([
        carregarMensagens(),
        carregarProjetosDestacados(),
        obterRepositorios(),
      ]);

      definirMensagens(listaMensagens);
      definirDestacados(listaDestacados);
      definirRepositorios(listaRepositorios);
    } catch (erroCarregamento) {
      definirErro(erroCarregamento.message || 'Não foi possível carregar o painel.');
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  async function atualizarMensagem(mensagem) {
    definirSalvando(mensagem.id);
    definirRetorno('');

    try {
      await marcarMensagemRespondida(mensagem.id, !mensagem.responded);
      await carregarDados();
    } catch (erroAtualizacao) {
      definirRetorno(erroAtualizacao.message || 'Não foi possível atualizar a mensagem.');
    } finally {
      definirSalvando('');
    }
  }

  async function atualizarDestaque(nome, selecionado) {
    definirSalvando(nome);
    definirRetorno('');

    try {
      await alterarProjetoDestacado(nome, selecionado);
      await carregarDados();
    } catch (erroAtualizacao) {
      definirRetorno(erroAtualizacao.message || 'Não foi possível atualizar os destaques.');
    } finally {
      definirSalvando('');
    }
  }

  async function sair() {
    try {
      await encerrarSessao();
      await recarregar();
      navegar('/painel');
    } catch (erroSaida) {
      definirRetorno(erroSaida.message || 'Não foi possível encerrar a sessão.');
    }
  }

  const mensagensFiltradas = mensagens.filter(
    (mensagem) =>
      filtro === 'all' || (filtro === 'pending' ? !mensagem.responded : mensagem.responded),
  );

  return (
    <div className="container page section panel-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
          <h1>
            Seu espaço de controle<span className="accent">.</span>
          </h1>
          <p className="muted">{usuario?.email}</p>
        </div>
        <button className="button button-outline button-small" type="button" onClick={sair}>
          Sair da conta <Icon name="arrow" size={16} />
        </button>
      </div>

      <div className="dashboard-tabs" role="group" aria-label="Seções do painel">
        <button aria-pressed={aba === 'messages'} onClick={() => definirAba('messages')}>
          Mensagens <span>{mensagens.filter((mensagem) => !mensagem.responded).length}</span>
        </button>
        <button aria-pressed={aba === 'featured'} onClick={() => definirAba('featured')}>
          Projetos em destaque
        </button>
      </div>

      {retorno && (
        <p className="form-feedback error" role="alert">
          {retorno}
        </p>
      )}

      {carregando ? (
        <EstadoCarregamento texto="Carregando painel…" />
      ) : erro ? (
        <EstadoErro mensagem={erro} aoTentarNovamente={carregarDados} />
      ) : aba === 'messages' ? (
        <section>
          <div className="panel-section-heading">
            <h2>Conversas recebidas</h2>
            <label className="inline-label">
              Exibir
              <select value={filtro} onChange={(evento) => definirFiltro(evento.target.value)}>
                <option value="all">Todas</option>
                <option value="pending">Pendentes</option>
                <option value="answered">Respondidas</option>
              </select>
            </label>
          </div>

          {mensagensFiltradas.length ? (
            <div className="message-list">
              {mensagensFiltradas.map((mensagem) => (
                <article className="message-card" key={mensagem.id}>
                  <div className="message-header">
                    <div>
                      <h3>{mensagem.name || 'Remetente sem nome'}</h3>
                      <a href={`mailto:${mensagem.email}`}>{mensagem.email}</a>
                    </div>
                    <time dateTime={mensagem.created_at}>{formatarData(mensagem.created_at)}</time>
                  </div>
                  <span className={`tag ${mensagem.responded ? 'tag-success' : ''}`}>
                    {mensagem.responded ? 'Respondida' : 'Pendente'}
                  </span>
                  {!mensagem.email_sent && (
                    <span className="tag tag-warning">Notificação de e-mail pendente</span>
                  )}
                  <h4>{mensagem.subject}</h4>
                  <p className="message-content">{mensagem.message}</p>
                  <div className="message-actions">
                    <a
                      className="text-link"
                      href={`mailto:${mensagem.email}?subject=${encodeURIComponent(`Re: ${mensagem.subject}`)}`}
                    >
                      Responder por e-mail <Icon name="arrow" size={16} />
                    </a>
                    <button
                      disabled={Boolean(salvando)}
                      className="button button-small button-outline"
                      onClick={() => atualizarMensagem(mensagem)}
                      type="button"
                    >
                      {salvando === mensagem.id
                        ? 'Salvando…'
                        : mensagem.responded
                          ? 'Marcar como pendente'
                          : 'Marcar como respondida'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVazio titulo="Nenhuma mensagem nesta lista">
              As mensagens enviadas pelo formulário serão exibidas aqui.
            </EstadoVazio>
          )}
        </section>
      ) : (
        <section>
          <div className="panel-section-heading">
            <div>
              <h2>Destaques da página inicial</h2>
              <p className="muted">As alterações são salvas no banco e ficam visíveis para visitantes.</p>
            </div>
            <Link to="/" className="text-link">
              Ver início <Icon name="arrow" size={16} />
            </Link>
          </div>

          {!destacados.length && (
            <p className="notice">
              Sem seleção, a página inicial mostra os três repositórios mais recentes.
            </p>
          )}

          {repositorios.length ? (
            <div className="featured-list">
              {repositorios.map((repositorio) => (
                <label className="featured-option" key={repositorio.id}>
                  <span>
                    <strong>{repositorio.name}</strong>
                    <small aria-live="polite">
                      {salvando === repositorio.name
                        ? 'Salvando…'
                        : repositorio.language || 'Sem linguagem informada'}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    aria-label={`Destacar ${repositorio.name}`}
                    checked={destacados.some((item) => item.repo_name === repositorio.name)}
                    disabled={Boolean(salvando)}
                    onChange={(evento) =>
                      atualizarDestaque(repositorio.name, evento.target.checked)
                    }
                  />
                </label>
              ))}
            </div>
          ) : (
            <EstadoVazio titulo="Nenhum projeto disponível">
              Publique seus repositórios no GitHub para selecioná-los.
            </EstadoVazio>
          )}
        </section>
      )}
    </div>
  );
}
