# 🚀 Configuração do Railway - Gestus App

## ❌ Problema Atual
A aplicação está falhando no Railway com o erro:
```
❌ Failed to connect to database: PrismaClientInitializationError: Can't reach database server at localhost:5432
```

## 🔧 Solução

### 1. Configurar Banco de Dados PostgreSQL no Railway

1. **Acesse seu projeto no Railway**
2. **Adicione um serviço PostgreSQL:**
   - Clique em "New Service"
   - Selecione "Database" → "PostgreSQL"
   - Aguarde a criação do banco

### 2. Configurar Variáveis de Ambiente

No seu serviço de backend no Railway, vá para a aba "Variables" e adicione:

```bash
# Database (será injetado automaticamente pelo Railway)
DATABASE_URL="postgresql://user:password@host:port/database"

# Application
NODE_ENV="production"
PORT="3000"

# JWT Secret (gere uma string segura)
JWT_SECRET="sua-chave-jwt-super-segura-aqui"

# Frontend URL (se necessário)
FRONTEND_URL="https://seu-frontend.railway.app"
```

### 3. Conectar o Banco ao Backend

1. **No serviço PostgreSQL:**
   - Vá para a aba "Connect"
   - Copie a "Connection URL"

2. **No serviço Backend:**
   - Vá para a aba "Variables"
   - Adicione a variável `DATABASE_URL` com a URL copiada

### 4. Executar Migrações

Após configurar a `DATABASE_URL`, você pode executar as migrações do Prisma:

```bash
# No terminal do Railway (ou localmente com DATABASE_URL configurada)
npx prisma migrate deploy
```

## 🔍 Debug

### Logs Adicionados
A aplicação agora inclui logs detalhados para debug:

- ✅ Verificação da `DATABASE_URL` no startup
- ✅ Logs de conexão do Prisma
- ✅ Verificação de variáveis de ambiente

### Verificar Logs no Railway
1. Vá para o serviço backend
2. Clique na aba "Deployments"
3. Clique no deployment mais recente
4. Verifique os logs para:
   - `🔗 DATABASE_URL: postgresql://***:***@...`
   - `🔄 Attempting to connect to database...`
   - `✅ Prisma Client connected successfully`

## 🚨 Troubleshooting

### Se ainda estiver falhando:

1. **Verifique se a `DATABASE_URL` está correta:**
   - Deve começar com `postgresql://`
   - Deve conter host, porta, usuário, senha e database

2. **Verifique se o banco está acessível:**
   - Teste a conexão no Railway
   - Verifique se não há firewall bloqueando

3. **Verifique as migrações:**
   - Execute `npx prisma migrate deploy` se necessário

## 📋 Checklist

- [ ] Banco PostgreSQL criado no Railway
- [ ] `DATABASE_URL` configurada no backend
- [ ] `NODE_ENV=production` configurado
- [ ] `PORT=3000` configurado
- [ ] `JWT_SECRET` configurado
- [ ] Migrações executadas (se necessário)
- [ ] Deploy realizado
- [ ] Logs verificados

## 🎯 Próximos Passos

1. Configure o banco de dados conforme instruções acima
2. Faça o deploy
3. Verifique os logs
4. Teste a aplicação

---

**Nota:** O Railway geralmente injeta automaticamente a `DATABASE_URL` quando você conecta um serviço de banco de dados ao seu projeto. Se isso não acontecer, configure manualmente conforme descrito acima.
