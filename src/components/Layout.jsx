import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import Icon from './Icon.jsx';

function getInitialTheme() {
  try {
    return localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function Layout() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // O tema segue funcional quando o armazenamento local estiver indisponível.
    }
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    const pageTitle = location.pathname === '/' ? 'Início' : location.pathname.split('/')[1];
    document.title = `${pageTitle} | Lucas Kobayashi`;
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Lucas Kobayashi, início">
            <span className="brand-mark">
              lk<span>.</span>
            </span>
            <span className="brand-name">
              Lucas
              <br />
              Kobayashi
            </span>
          </Link>
          <nav
            aria-label="Navegação principal"
            className={menuOpen ? 'nav is-open' : 'nav'}
            id="main-nav"
          >
            <NavLink to="/" end>
              Início
            </NavLink>
            <NavLink to="/projetos">Projetos</NavLink>
            <NavLink to="/sobre">Sobre</NavLink>
            <NavLink to="/contato">
              Contato <Icon name="arrow" size={15} />
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
              title={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <button
              className="icon-button menu-toggle"
              type="button"
              aria-controls="main-nav"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <main className="main" id="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Link className="footer-signature" to="/">
            Lucas Kobayashi<span>© {new Date().getFullYear()}</span>
          </Link>
          <p>Feito com React, curiosidade e café.</p>
          <div className="footer-links">
            <a href="https://github.com/kobaxzs" target="_blank" rel="noreferrer">
              GitHub <Icon name="arrow" size={14} />
            </a>
            <Link to="/sobre">Sobre mim</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
