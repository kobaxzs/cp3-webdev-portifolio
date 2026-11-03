import { perfil } from '../config.js';
import CardProject from '../components/ProjectCard.jsx';
import { EstadoVazio, EstadoErro, EsqueletosProjetos } from '../components/Feedback.jsx';
import Icon from '../components/Icon.jsx';
import useAsyncData from '../hooks/useAsyncData.js';
import { obterRepositorios } from '../services/github.js';

export default function ProjectsPage() {
  const {
    dados: repositorios,
    carregando,
    erro,
    tentarNovamente,
  } = useAsyncData(obterRepositorios);

  return (
    <div className="container page section">
      <div className="page-heading">
        <p className="eyebrow">PORTFÓLIO / PROJETOS</p>
        <h1>
          Aprendizado que
          <br />
          vira <span>construção.</span>
        </h1>
        <p>
          Cada repositório, uma etapa da jornada. Explore meus projetos públicos e acompanhe o
          código.
        </p>
        <a
          className="text-link"
          href={`https://github.com/${perfil.usuarioGithub}`}
          target="_blank"
          rel="noreferrer"
        >
          Visitar meu GitHub <Icon name="arrow" size={17} />
        </a>
      </div>

      {carregando ? (
        <EsqueletosProjetos quantidade={6} />
      ) : erro ? (
        <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />
      ) : repositorios.length ? (
        <div className="project-grid">
          {repositorios.map((repositorio, indice) => (
            <CardProject repositorio={repositorio} indice={indice} key={repositorio.id} />
          ))}
        </div>
      ) : (
        <EstadoVazio titulo="Ainda não há projetos públicos">
          Os repositórios aparecerão aqui quando forem publicados no GitHub.
        </EstadoVazio>
      )}

      <p className="source-note">
        Fonte: API pública do GitHub · Repositórios próprios, ordenados pela última atualização.
      </p>
    </div>
  );
}
