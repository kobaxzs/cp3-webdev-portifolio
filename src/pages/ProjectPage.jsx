import { Link, useParams } from 'react-router';
import useAsyncData from '../hooks/useAsyncData.js';
import { obterRepositorios, validarUrlExterna } from '../services/github.js';
import { EstadoVazio, EstadoErro, EstadoCarregamento } from '../components/Feedback.jsx';
import { ArteProjeto } from '../components/ProjectCard.jsx';
import Icon from '../components/Icon.jsx';

export default function ProjectPage() {
  const { name } = useParams();
  const {
    dados: repositorios,
    carregando,
    erro,
    tentarNovamente,
  } = useAsyncData(obterRepositorios);

  if (carregando) {
    return (
      <div className="container section">
        <EstadoCarregamento texto="Carregando detalhes do projeto…" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container section">
        <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />
      </div>
    );
  }

  const repositorio = repositorios.find((item) => item.name === name);

  if (!repositorio) {
    return (
      <div className="container section">
        <EstadoVazio titulo="Projeto não encontrado">
          Este repositório pode ter sido renomeado, removido ou tornado privado.
        </EstadoVazio>
        <Link to="/projetos" className="button">
          Voltar aos projetos
        </Link>
      </div>
    );
  }

  const urlPublicada = validarUrlExterna(repositorio.homepage);

  return (
    <article className="container page section">
      <Link to="/projetos" className="text-link back-link">
        ← Todos os projetos
      </Link>

      <div className="project-detail-heading">
        <div>
          <p className="eyebrow">DO MEU GITHUB / {repositorio.language || 'REPOSITÓRIO'}</p>
          <h1>
            {repositorio.name.replaceAll('-', ' ')}
            <span className="accent">.</span>
          </h1>
          <p className="lead">
            {repositorio.description ||
              'O autor ainda não adicionou uma descrição a este repositório no GitHub.'}
          </p>
        </div>

        <div className="detail-actions">
          <a href={repositorio.html_url} target="_blank" rel="noreferrer" className="button">
            <Icon name="github" />
            Ver código <Icon name="arrow" size={16} />
          </a>
          {urlPublicada && (
            <a
              href={urlPublicada}
              target="_blank"
              rel="noreferrer"
              className="button button-outline"
            >
              Abrir projeto <Icon name="arrow" size={16} />
            </a>
          )}
        </div>
      </div>

      <ArteProjeto repositorio={repositorio} indice={repositorios.indexOf(repositorio)} grande />

      <div className="detail-grid">
        <section>
          <p className="eyebrow">SOBRE O REPOSITÓRIO</p>
          <h2>Código aberto para explorar.</h2>
          <p>
            Este projeto é carregado diretamente do GitHub. Lá você encontra os arquivos, o
            histórico de desenvolvimento e o README com as instruções disponíveis.
          </p>
          <div className="tag-list">
            {(repositorio.topics || []).map((topico) => (
              <span className="tag" key={topico}>
                {topico}
              </span>
            ))}
          </div>
        </section>

        <dl className="repo-facts">
          <div>
            <dt>Linguagem principal</dt>
            <dd>{repositorio.language || 'Não informada'}</dd>
          </div>
          <div>
            <dt>Criado em</dt>
            <dd>{new Date(repositorio.created_at).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Última atualização</dt>
            <dd>{new Date(repositorio.updated_at).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Estrelas / Forks</dt>
            <dd>
              {repositorio.stargazers_count} / {repositorio.forks_count}
            </dd>
          </div>
          <div>
            <dt>Licença</dt>
            <dd>{repositorio.license?.name || 'Não informada'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
