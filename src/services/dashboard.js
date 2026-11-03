import { clienteSupabase } from './supabase.js';

function validarConfiguracao() {
  if (!clienteSupabase) {
    throw new Error('Configure as variáveis do Supabase para acessar o painel.');
  }
}

export async function carregarMensagens() {
  validarConfiguracao();

  const { data, error } = await clienteSupabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function carregarProjetosDestacados() {
  validarConfiguracao();

  const { data, error } = await clienteSupabase
    .from('featured_projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function alterarProjetoDestacado(nome, ativado) {
  validarConfiguracao();

  const nomeNormalizado = nome.trim();

  if (!nomeNormalizado) {
    throw new Error('Informe o nome do repositório para adicionar à lista destacada.');
  }

  if (ativado) {
    const { error } = await clienteSupabase.from('featured_projects').insert({
      repo_name: nomeNormalizado,
    });

    if (error) throw error;
    return;
  }

  const { error } = await clienteSupabase
    .from('featured_projects')
    .delete()
    .eq('repo_name', nomeNormalizado);

  if (error) throw error;
}
