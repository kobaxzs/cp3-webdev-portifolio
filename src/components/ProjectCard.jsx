import { Link } from 'react-router';
import Icon from './Icon.jsx';

export function ArteProjeto({ repositorio, indice = 0, grande = false }) {
  return (
    <div
      className={`project-art art-${indice % 4}${grande ? ' art-large' : ''}`}
      aria-hidden="true"
    >
      <img
        className="project-art-image"
        src={`/images/project-${indice % 4}.svg`}
        alt=""
        width="660"
        height="400"
        loading="lazy"
        decoding="async"
      />
      <span className="art-caption">{repositorio.language || 'REPOSITÓRIO'}</span>
      <div className="art-label">
        <span className="art-repo">{repositorio.name}</span>
        <span className="art-path">/{repositorio.owner?.login || 'projeto'}/</span>
      </div>
      <span className="art-index">{String(indice + 1).padStart(2, '0')}</span>
    </div>
  );
}

export default function CardProject({ repositorio, indice }) {
  return (
    <article className="project-card">
      <Link
        className="project-image-link"
        to={`/projetos/${encodeURIComponent(repositorio.name)}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ArteProjeto repositorio={repositorio} indice={indice} />
      </Link>
      <div className="project-body">
        <div className="project-heading">
          <h3>
            <Link to={`/projetos/${encodeURIComponent(repositorio.name)}`}>
              {repositorio.name.replaceAll('-', ' ')}
            </Link>
          </h3>
          <Icon name="arrow" size={18} />
        </div>
        <p>
          {repositorio.description ||
            'Repositório público. Explore o código e os detalhes do projeto.'}
        </p>
        <div className="project-meta">
          <span>
            <i className={`language-dot language-${repositorio.language?.toLowerCase()}`} />
            {repositorio.language || 'Sem linguagem informada'}
          </span>
          <span>
            <Icon name="star" size={13} />
            {repositorio.stargazers_count}
          </span>
          <time dateTime={repositorio.updated_at}>
            {new Date(repositorio.updated_at).toLocaleDateString('pt-BR')}
          </time>
        </div>
      </div>
    </article>
  );
}
