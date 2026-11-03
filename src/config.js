const ambiente = import.meta.env;

export const perfil = {
  nome: 'Lucas Figueiredo Kobayashi',
  nomeCurto: 'Lucas Kobayashi',
  usuarioGithub: ambiente.VITE_USUARIO_GITHUB || 'kobaxzs',
  email: ambiente.VITE_EMAIL_CONTATO || 'lucasfkobayashi19@gmail.com',
  linkedin: ambiente.VITE_URL_LINKEDIN || '',
};

export const configuracaoSupabase = {
  url: ambiente.VITE_URL_SUPABASE || '',
  chave: ambiente.VITE_CHAVE_PUBLICA_SUPABASE || '',
};

export const temConfiguracaoBanco = Boolean(configuracaoSupabase.url && configuracaoSupabase.chave);
