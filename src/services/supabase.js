import { createClient as criarCliente } from '@supabase/supabase-js';
import { configuracaoSupabase, temConfiguracaoBanco } from '../config.js';

export const clienteSupabase = temConfiguracaoBanco
  ? criarCliente(configuracaoSupabase.url, configuracaoSupabase.chave, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export async function verificarDono() {
  if (!clienteSupabase) return false;

  const {
    data: { user },
    error,
  } = await clienteSupabase.auth.getUser();

  if (error || !user) return false;

  const { data, error: erroPermissao } = await clienteSupabase
    .from('portfolio_owners')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (erroPermissao) throw erroPermissao;

  return Boolean(data);
}

export async function entrarNaConta(email, senha) {
  if (!clienteSupabase) {
    throw new Error('Configure as variáveis do Supabase para acessar o painel.');
  }

  const { data, error } = await clienteSupabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;

  return data?.user ?? null;
}

export async function encerrarSessao() {
  if (!clienteSupabase) return;

  const { error } = await clienteSupabase.auth.signOut();

  if (error) throw error;
}
