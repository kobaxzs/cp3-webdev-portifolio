import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';

export default function HomePage() {
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> ESTUDANTE DE ENGENHARIA DE SOFTWARE
          </p>
          <h1>
            Ideias em mente.
            <br />
            Código <span>na tela.</span>
          </h1>
          <p className="hero-intro">
            Oi, sou o Lucas <span aria-hidden="true">↗</span>
          </p>
          <p className="hero-description">
            Estudo Engenharia de Software na FIAP e estou construindo meu caminho no
            desenvolvimento. Aqui, compartilho o que aprendo e o que transformo em projeto.
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/projetos">
              Explorar projetos <Icon name="right" size={18} />
            </Link>
            <Link className="text-link" to="/contato">
              Vamos conversar <Icon name="arrow" size={17} />
            </Link>
          </div>
          <div className="hero-footnote">
            <span>APRENDER. CONSTRUIR. EVOLUIR.</span>
            <span className="hero-line" />
          </div>
        </div>
        <div className="hero-visual" aria-label="Diário visual da minha jornada de aprendizado">
          <div className="visual-label">
            <span>DIÁRIO DE CONSTRUÇÃO</span>
            <Icon name="arrow" size={18} />
          </div>
          <div className="code-window">
            <div className="code-window-bar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>lucas.jsx</span>
              <span>JSX</span>
            </div>
            <div className="code-content">
              <span className="code-comment">// Um projeto de cada vez.</span>
              <p>
                <span className="code-purple">const</span>{' '}
                <span className="code-orange">desenvolvedor</span> = {'{'}
              </p>
              <div className="code-indent">
                <p>
                  nome: <span className="code-green">'Lucas Kobayashi'</span>,
                </p>
                <p>
                  formação: <span className="code-green">'Eng. de Software'</span>,
                </p>
                <p>
                  instituição: <span className="code-green">'FIAP'</span>,
                </p>
                <p>
                  foco: [<span className="code-green">'aprender'</span>,{' '}
                  <span className="code-green">'criar'</span>],
                </p>
                <p>
                  próximoPasso: <span className="code-purple">() =&gt;</span>{' '}
                  <span className="code-orange">evoluir</span>()
                </p>
              </div>
              <p>{'}'};</p>
              <p className="code-last">
                <span className="code-purple">export default</span> desenvolvedor;
                <span className="code-cursor" />
              </p>
            </div>
            <div className="code-status">
              <span>
                <span className="status-dot" /> Em constante desenvolvimento
              </span>
              <span>UTF-8</span>
            </div>
          </div>
          <div className="floating-label">
            <span className="floating-icon">
              <Icon name="branch" size={22} />
            </span>
            <span>
              Da ideia ao primeiro commit.<small>O aprendizado acontece construindo.</small>
            </span>
          </div>
          <Icon className="visual-cross" name="sparkle" />
        </div>
      </section>
      <div className="tech-strip">
        <div className="container tech-strip-inner">
          <span>NA MINHA JORNADA</span>
          {['JavaScript', 'React', 'HTML & CSS', 'Git & GitHub'].map((skill) => (
            <span className="tech-strip-item" key={skill}>
              <Icon name="sparkle" size={13} />
              <strong>{skill}</strong>
            </span>
          ))}
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / DA TEORIA À PRÁTICA</p>
            <h2>
              Projetos recentes<span className="accent">.</span>
            </h2>
          </div>
          <Link className="text-link" to="/projetos">
            Ver projetos <Icon name="arrow" size={18} />
          </Link>
        </div>
        <p className="section-description">
          Código real, aprendizado contínuo. Em breve, os repositórios públicos do GitHub aparecem
          aqui.
        </p>
        <div className="project-intro">
          <span className="project-intro-index">/ 01</span>
          <div>
            <h3>Uma jornada feita de projetos</h3>
            <p>
              Estou preparando a conexão com o GitHub para mostrar o código e o processo por trás de
              cada ideia.
            </p>
          </div>
          <Link className="icon-button" to="/projetos" aria-label="Abrir projetos">
            <Icon name="right" />
          </Link>
        </div>
      </section>
      <section className="container about-preview">
        <div>
          <p className="eyebrow">02 / POR TRÁS DO CÓDIGO</p>
          <h2>
            Curiosidade é o<br />
            meu ponto de partida.
          </h2>
        </div>
        <div>
          <p>
            Sou Lucas, estudante de Engenharia de Software na FIAP. Estou explorando como
            transformar problemas em interfaces e soluções que façam sentido.
          </p>
          <p>Este portfólio reúne meus projetos e acompanha minha evolução.</p>
          <Link className="text-link" to="/sobre">
            Um pouco mais sobre mim <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <section className="container contact-banner">
        <div>
          <p className="eyebrow">O PRÓXIMO PASSO PODE SER UMA CONVERSA</p>
          <h2>
            Vamos construir
            <br />
            uma conexão?
          </h2>
        </div>
        <Link className="round-link" to="/contato" aria-label="Ir para contato">
          <Icon name="arrow" size={38} />
        </Link>
      </section>
    </>
  );
}
