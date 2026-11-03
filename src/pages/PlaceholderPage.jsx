import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';

export default function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <section className="container page section placeholder-page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {title}
        <span className="accent">.</span>
      </h1>
      <p className="lead">{description}</p>
      <Link className="button" to="/">
        Voltar ao início <Icon name="right" size={18} />
      </Link>
    </section>
  );
}
