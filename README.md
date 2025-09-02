# Nova Agro - Sistema de Gestão

Sistema web completo para gestão de materiais agropecuários e automação eletro-hidráulica, incluindo controle financeiro, estoque e emissão de notas fiscais.

## 🚀 Funcionalidades

### Módulos Principais
- **Dashboard**: Visão geral do sistema com indicadores e gráficos
- **Produtos**: Catálogo completo com preços, estoque e variações
- **Estoque**: Controle de inventário e movimentações
- **Parceiros**: Gestão de clientes e fornecedores
- **Pedidos**: Controle de compras e vendas
- **Notas Fiscais**: Emissão e controle de documentos fiscais
- **Financeiro**: Contas a pagar/receber e fluxo de caixa
- **Fiscal**: Emissão de NFe, NFS-e e NFC-e
- **Relatórios**: Análises e exportações

### Características Técnicas
- ✅ Autenticação JWT com refresh tokens
- ✅ RBAC (Role-Based Access Control)
- ✅ API REST com documentação Swagger
- ✅ Interface responsiva e moderna
- ✅ Validação de dados com Zod
- ✅ Gerenciamento de estado com Zustand
- ✅ Cache e otimizações com React Query
- ✅ Suporte a temas claro/escuro
- ✅ Trilha de auditoria completa

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **TypeScript**
- **NestJS** (Framework)
- **Prisma** (ORM)
- **PostgreSQL** (Banco de dados)
- **Redis** (Cache e filas)
- **MinIO** (Armazenamento de arquivos)
- **JWT** (Autenticação)
- **Swagger** (Documentação)

### Frontend
- **React** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (Componentes)
- **React Router** (Roteamento)
- **Zustand** (Estado global)
- **React Query** (Cache e sincronização)
- **React Hook Form** + **Zod** (Formulários)

### Infraestrutura
- **Docker** + **Docker Compose**
- **PostgreSQL** (Produção)
- **Redis** (Cache)
- **MinIO** (Arquivos)

## 📋 Pré-requisitos

- Node.js 18+
- Git
- Docker e Docker Compose (recomendado) ou PostgreSQL + Redis instalados localmente

## 🚀 Instalação e Execução

### Opção 1: Com Docker (Recomendado)

#### 1. Instale o Docker Desktop
- **Windows**: Baixe e instale o [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- **macOS**: Baixe e instale o [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- **Linux**: Siga as instruções para sua distribuição em [docs.docker.com](https://docs.docker.com/engine/install/)

#### 2. Clone o repositório
```bash
git clone <repository-url>
cd nova-agro
```

#### 3. Instale as dependências
```bash
npm install
```

#### 4. Configure as variáveis de ambiente
```bash
# Backend
cp apps/backend/env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

#### 5. Inicie os serviços com Docker
```bash
npm run docker:up
```

#### 6. Execute as migrações do banco
```bash
npm run db:migrate
```

#### 7. Popule o banco com dados de exemplo
```bash
npm run db:seed
```

#### 8. Inicie o desenvolvimento
```bash
npm run dev
```

### Opção 2: Sem Docker (Desenvolvimento Local)

#### 1. Instale PostgreSQL e Redis
- **PostgreSQL**: [postgresql.org/download](https://www.postgresql.org/download/)
- **Redis**: [redis.io/download](https://redis.io/download)

#### 2. Clone o repositório
```bash
git clone <repository-url>
cd nova-agro
```

#### 3. Instale as dependências
```bash
npm install
```

#### 4. Configure as variáveis de ambiente
```bash
# Backend
cp apps/backend/env.example apps/backend/.env
```

Edite o arquivo `apps/backend/.env` e configure:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nova_agro"
REDIS_URL="redis://localhost:6379"
```

#### 5. Execute as migrações do banco
```bash
npm run db:migrate
```

#### 6. Popule o banco com dados de exemplo
```bash
npm run db:seed
```

#### 7. Inicie o desenvolvimento
```bash
npm run dev
```

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **MinIO Console**: http://localhost:9001

## 👤 Credenciais de Teste

- **Email**: admin@novaagro.com
- **Senha**: admin123

## 📁 Estrutura do Projeto

```
nova-agro/
├── apps/
│   ├── backend/          # API NestJS
│   │   ├── src/
│   │   │   ├── modules/  # Módulos de negócio
│   │   │   ├── common/   # Serviços compartilhados
│   │   │   └── database/ # Configuração do banco
│   │   └── prisma/       # Schema e migrações
│   └── frontend/         # Interface React
│       ├── src/
│       │   ├── components/ # Componentes reutilizáveis
│       │   ├── pages/      # Páginas da aplicação
│       │   ├── services/   # Serviços de API
│       │   └── stores/     # Estado global
├── packages/
│   └── shared/           # Código compartilhado
└── docker-compose.yml    # Configuração Docker
```

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia frontend e backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend
```

### Build
```bash
npm run build            # Build completo
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend
```

### Testes
```bash
npm run test             # Executa todos os testes
npm run test:frontend    # Testes do frontend
npm run test:backend     # Testes do backend
```

### Docker
```bash
npm run docker:up        # Inicia containers
npm run docker:down      # Para containers
```

### Banco de Dados
```bash
npm run db:migrate       # Executa migrações
npm run db:seed          # Popula com dados de exemplo
```

## 📊 Funcionalidades por Módulo

### Produtos
- ✅ Cadastro completo com SKU, NCM, CEST
- ✅ Preços e variações
- ✅ Controle de estoque por depósito
- ✅ Categorização e marcação

### Estoque
- ✅ Movimentações de entrada/saída
- ✅ Transferências entre depósitos
- ✅ Controle de lotes e séries
- ✅ Alertas de estoque baixo

### Parceiros
- ✅ Clientes e fornecedores
- ✅ Dados fiscais completos
- ✅ Múltiplos endereços
- ✅ Histórico de transações

### Pedidos
- ✅ Orçamentos e pedidos
- ✅ Ordens de serviço
- ✅ Aprovações e workflow
- ✅ Rastreamento de status

### Financeiro
- ✅ Contas a pagar/receber
- ✅ Fluxo de caixa
- ✅ Conciliação bancária
- ✅ Relatórios gerenciais

### Fiscal
- ✅ Emissão de NFe (55)
- ✅ NFS-e para serviços
- ✅ NFC-e para balcão
- ✅ Importação de XMLs

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- RBAC com permissões granulares
- Validação de dados em todas as camadas
- Criptografia de senhas
- Rate limiting
- CORS configurado
- Trilha de auditoria completa

## 📈 Performance

- Cache com Redis
- Paginação server-side
- Lazy loading de componentes
- Otimizações de queries
- Compressão de assets
- CDN ready

## 🧪 Testes

- Testes unitários com Jest
- Testes de integração
- Testes E2E com Playwright
- Cobertura de código
- CI/CD com GitHub Actions

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: suporte@novaagro.com
- Issues: [GitHub Issues](https://github.com/nova-agro/issues)

---

Desenvolvido com ❤️ para a Nova Agro
