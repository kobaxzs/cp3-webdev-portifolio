import { createContext, useContext } from 'react';

export const ContextoAutenticacao = createContext(null);

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);

  if (!contexto) {
    throw new Error('O provedor de autenticação deve envolver o componente.');
  }

  return contexto;
}
