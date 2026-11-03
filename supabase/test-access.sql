-- Script de verificação de permissões do Supabase.
-- Execute em um contexto autenticado para validar o comportamento do RLS.

begin;

select 'portfolio_owners' as tabela, count(*) as linhas from public.portfolio_owners;
select 'messages' as tabela, count(*) as linhas from public.messages;
select 'featured_projects' as tabela, count(*) as linhas from public.featured_projects;

rollback;
