import { useEffect, useMemo, useState } from 'react';
import { ContextoAutenticacao } from '../hooks/useAutenticacao.js';
import { clienteSupabase, verificarDono } from '../services/supabase.js';

export default function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [autorizado, setAutorizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function sincronizarSessao(sessaoAtual) {
      if (!ativo) return;

      const usuarioAtual = sessaoAtual?.user ?? null;
      setUsuario(usuarioAtual);

      if (!usuarioAtual) {
        setAutorizado(false);
        setCarregando(false);
        return;
      }

      try {
        const dono = await verificarDono();

        if (ativo) {
          setAutorizado(Boolean(dono));
        }
      } catch {
        if (ativo) {
          setAutorizado(false);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    if (!clienteSupabase) {
      setUsuario(null);
      setAutorizado(false);
      setCarregando(false);
      return undefined;
    }

    clienteSupabase.auth.getUser().then(({ data }) => {
      void sincronizarSessao({ user: data.user ?? null });
    });

    const { data: inscricao } = clienteSupabase.auth.onAuthStateChange((_evento, sessao) => {
      void sincronizarSessao(sessao);
    });

    return () => {
      ativo = false;
      inscricao?.subscription?.unsubscribe?.();
    };
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      autorizado,
      carregando,
      setUsuario,
      setAutorizado,
      async recarregar() {
        if (!clienteSupabase) {
          setUsuario(null);
          setAutorizado(false);
          setCarregando(false);
          return;
        }

        setCarregando(true);
        const {
          data: { user },
        } = await clienteSupabase.auth.getUser();

        setUsuario(user ?? null);

        if (!user) {
          setAutorizado(false);
          setCarregando(false);
          return;
        }

        try {
          const dono = await verificarDono();
          setAutorizado(Boolean(dono));
        } catch {
          setAutorizado(false);
        } finally {
          setCarregando(false);
        }
      },
    }),
    [autorizado, carregando, usuario],
  );

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>;
}
