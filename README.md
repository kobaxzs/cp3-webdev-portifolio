# CP3 Portfolio

Portfolio pessoal em React + Vite com páginas públicas, integração com GitHub, formulário de contato e painel administrativo protegido por Supabase.

## Estrutura

- `src/pages/` — páginas públicas e administrativas
- `src/components/` — layout, formulário e componentes reutilizáveis
- `src/services/` — integrações com GitHub e Supabase
- `server/` — lógica do backend local para desenvolvimento
- `api/` — endpoint serverless do Vercel para o formulário de contato
- `supabase/` — schema e testes de permissões

## Requisitos

- Node.js 22+
- Conta no GitHub
- Projeto no Supabase
- Chave da API Resend
- Conta no Vercel

## Variáveis de ambiente

Crie um arquivo `.env` a partir do exemplo em `.env.example` e preencha os valores reais.

### Frontend público

- `VITE_USUARIO_GITHUB`
- `VITE_EMAIL_CONTATO`
- `VITE_URL_LINKEDIN`
- `VITE_URL_SUPABASE`
- `VITE_CHAVE_PUBLICA_SUPABASE`

### Servidor e integrações

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

> As chaves privadas ficam apenas no servidor e no ambiente de deploy. Não versionar `.env`.

## Execução local

1. Instale as dependências:
   npm install
2. Copie o exemplo de ambiente:
   cp .env.example .env
3. Ajuste os valores para o seu projeto.
4. Inicie o projeto:
   npm run dev

A aplicação roda em `http://127.0.0.1:5173` por padrão.

## Supabase

1. Crie um projeto no Supabase.
2. Execute o SQL em `supabase/schema.sql` no SQL editor.
3. Crie o usuário de autenticação no painel de Authentication.
4. Cadastre o UUID do usuário na tabela `public.portfolio_owners`.
5. Verifique as políticas RLS e ajuste conforme o projeto.

O dashboard usa a tabela `messages` e `featured_projects`, enquanto o login exige um registro em `portfolio_owners`.

## Resend

1. Crie uma API key no Resend.
2. Configure o remetente autorizado.
3. Defina `CONTACT_TO_EMAIL` para o destinatário final e `CONTACT_FROM_EMAIL` para o endereço de envio.

## Deploy na Vercel

1. Conecte o repositório no Vercel.
2. Configure as variáveis de ambiente do projeto.
3. Use o comando de build padrão do Vite:
   npm run build
4. Publique a branch principal.

A pasta `api/` é usada para o endpoint de contato em produção.
