# Nova Agro (Frontend Local)

Aplicação simplificada para rodar somente no frontend, com dados salvos localmente no navegador (sem backend e sem Docker).

## O que foi simplificado

- Execução apenas com React + Vite.
- Persistência local via `localStorage`.
- Sem dependência de banco, Redis, MinIO ou serviços externos.
- Sem scripts de Docker/deploy.

## Requisitos

- Node.js 18+
- npm

## Como rodar

```bash
npm install
npm run dev
```

Acesse em:

- `http://localhost:5173` (porta padrão do Vite)

## Build

```bash
npm run build
npm run preview
```

## Credenciais locais padrão

- Email: `admin@gestus.local`
- Senha: `123456`

## Estrutura principal

```text
apps/frontend/
  src/
    pages/
    components/
    services/
    stores/
```

## Observação

Os dados ficam no navegador do usuário. Para resetar o ambiente, limpe o `localStorage` do domínio.
