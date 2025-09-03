# 🚀 Guia de Deploy no Railway - Gestus

## ⚠️ INSTRUÇÕES CRÍTICAS PARA RESOLVER O PROBLEMA DO DATABASE_URL

### 1. Configuração do PostgreSQL no Railway

1. **No seu projeto Railway, adicione um serviço PostgreSQL:**
   - Clique em "New Service" → "Database" → "PostgreSQL"
   - Aguarde a criação do banco

2. **Configure as variáveis de ambiente no serviço BACKEND:**
   - Vá para o serviço do seu backend (não o PostgreSQL)
   - Clique em "Variables"
   - Adicione as seguintes variáveis:

```
DATABASE_URL = ${{ Postgres.DATABASE_URL }}
NODE_ENV = production
PORT = 3000
JWT_SECRET = sua-chave-secreta-super-forte-aqui
```

### 2. Verificação das Variáveis

**IMPORTANTE:** Certifique-se de que:
- O nome da variável é exatamente `DATABASE_URL` (não `DATABASE_URL_2` ou similar)
- O valor é exatamente `${{ Postgres.DATABASE_URL }}` (com as chaves duplas)
- As variáveis estão no serviço BACKEND, não no PostgreSQL

### 3. Deploy

1. Faça commit e push das alterações:
```bash
git add .
git commit -m "Fix Railway deployment - enhanced DATABASE_URL handling"
git push origin develop
```

2. O Railway irá automaticamente fazer o redeploy

### 4. Verificação dos Logs

Após o deploy, verifique os logs do Railway. Você deve ver:
- `🔗 Using DATABASE_URL: postgresql://***:***@...`
- `✅ Prisma Client connected successfully`

### 5. Se ainda não funcionar

Se o problema persistir, verifique:
1. Se o serviço PostgreSQL está rodando
2. Se as variáveis estão configuradas corretamente
3. Se não há espaços extras nas variáveis

### 6. URL de Acesso

Após o deploy bem-sucedido, você receberá uma URL como:
`https://seu-projeto-production.up.railway.app`

## 🔧 Solução Implementada

As alterações feitas incluem:
- Script de inicialização mais robusto (`railway-start.js`)
- Logs detalhados para debug
- Múltiplas tentativas de obter DATABASE_URL
- Execução automática de migrações
- Tratamento de erros melhorado
