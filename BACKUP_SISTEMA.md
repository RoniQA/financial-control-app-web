# 📦 Sistema de Backup e Restauração de Dados

## 📋 Visão Geral

Um novo sistema de backup foi implementado na aplicação para proteger seus dados contra perda acidental. Você pode agora exportar todos os seus dados como um arquivo JSON e restaurá-los facilmente quando necessário.

---

## 🎯 Funcionalidades

### ✅ Exportar Dados (Backup)
- Salva todos os dados do navegador em um arquivo `.json`
- Inclui timestamp automático no nome do arquivo
- Arquivo pode ser armazenado em local seguro
- Suporta backup de toda a aplicação

### ✅ Importar Dados (Restauração)
- Restaura dados de um backup previamente exportado
- Valida automaticamente o arquivo
- Substitui os dados atuais pelos dados do backup
- Recarrega a página após sucesso

### ✅ Validação de Segurança
- Valida estrutura do arquivo
- Verifica se é um backup válido da aplicação
- Limita tamanho máximo de arquivo (10MB)
- Confirma ação antes de sobrescrever dados

---

## 📍 Acesso ao Sistema

1. Levante a aplicação
2. Vá para **Configurações** (⚙️ Settings)
3. Procure a seção **"Backup de Dados"** (parte inferior da página)

---

## 📥 Como Exportar Dados

### Passo a Passo

1. Navegue até a seção "Backup de Dados" em Configurações
2. Clique no botão **"Exportar Backup"** na seção "Exportar Dados"
3. Arquivo será baixado automaticamente com nome:
   ```
   gestus-backup-[timestamp].json
   ```
4. Salve o arquivo em um local seguro (Dropbox, Google Drive, pendrive, etc.)

### Exemplo de Arquivo Exportado

```json
{
  "version": "1.0",
  "timestamp": "2026-04-21T12:30:45.123Z",
  "data": {
    "db": {
      "users": [...],
      "products": [...],
      "partners": [...],
      "orders": [...],
      "etc": "..."
    },
    "auth-storage-v1": {
      "state": {
        "user": {...},
        "isAuthenticated": true
      }
    },
    "gestus-theme": {
      "state": {
        "theme": "dark"
      }
    }
  }
}
```

---

## 📤 Como Importar Dados

### Passo a Passo

1. Navegue até a seção "Backup de Dados" em Configurações
2. Clique no botão **"Selecionar Arquivo"** na seção "Importar Dados"
3. Escolha um arquivo `.json` de backup
4. **⚠️ IMPORTANTE:** Uma confirmação será pedida:
   ```
   ⚠️ Importar um backup vai SUBSTITUIR todos os dados atuais.
   
   Tem certeza que deseja continuar?
   ```
5. Clique "OK" para confirmar
6. Os dados serão restaurados e a página será recarregada automaticamente

### Aviso Importante

❌ **Ao importar um backup:**
- Todos os dados ATUAIS serão PERDIDOS
- Os dados do backup substituirão tudo
- Esta ação NÃO pode ser desfeita

💡 **Dica:** Sempre faça um backup dos dados atuais antes de importar um backup antigo!

---

## ⚠️ Cenários de Uso

### Cenário 1: Proteção Contra Limpeza de Cache
**Problema:** Usuário limpa cache do navegador e perde todos os dados

**Solução:**
1. Exportar backup regularmente
2. Se dados forem perdidos, importar o backup mais recente
3. Dados são restaurados completamente

### Cenário 2: Transferência Entre Computadores
**Problema:** Quer levar os dados para outro computador

**Solução:**
1. No computador A: Exportar backup
2. Compartilhar arquivo (email, pendrive, cloud, etc.)
3. No computador B: Importar o arquivo
4. Todos os dados são sincronizados

### Cenário 3: Recuperação de Dados Deletados
**Problema:** Deletou dados por engano

**Solução:**
1. Ter um backup anterior (antes da deleção)
2. Importar esse backup
3. Dados deletados são restaurados
4. Qualquer mudança pós-backup é perdida

### Cenário 4: Múltiplos Backups
**Problema:** Quer manter histórico de vários estados

**Solução:**
1. Nomear backups com datas: `gestus-backup-2026-04-21.json`
2. Armazenar em pasta de backups
3. Sempre ter acesso a versões antigas
4. Recuperar qualquer estado anterior quando necessário

---

## 📊 O Que é Incluído no Backup?

✅ Todos os produtos e suas informações
✅ Dados de parceiros (clientes/fornecedores)
✅ Todos os pedidos
✅ Dados de faturas
✅ Histórico de movimentações
✅ Configurações de usuário
✅ Preferências de tema
✅ Dados de autenticação
✅ Tudo armazenado em localStorage

---

## 🔒 Considerações de Segurança

### ✅ Seguro Para
- Backup local
- Armazenamento em dispositivos pessoais
- Sincronização entre seus próprios computadores
- Suportar a recuperação de dados locais

### ⚠️ NÃO Seguro Para
- Compartilhar o arquivo com terceiros (contém dados sensíveis)
- Armazenar em nuvem pública sem encriptação
- Confiar apenas em backup digital (sempre ter cópia física também)

### 💡 Melhor Prática
1. Fazer backups regularmente (semanal ou mensal)
2. Manter múltiplas cópias
3. Armazenar em local seguro
4. Testar restauração ocasionalmente
5. Documentar a lista de backups

---

## 🛠️ Validações Aplicadas

O sistema realiza as seguintes validações automaticamente:

| Validação | Descrição |
|-----------|-----------|
| **Formato de Arquivo** | Apenas `.json` permitido |
| **Tamanho Máximo** | Limite de 10MB |
| **Estrutura** | Verifica campos obrigatórios (`version`, `timestamp`, `data`) |
| **Versão** | Compatibilidade com versão de backup |
| **Confirmação** | Pede confirmação antes de sobrescrever |
| **Integridade** | Valida dados antes de restaurar |

---

## 🚨 Situações de Erro

### ❌ "Arquivo de backup inválido"
**Causa:** Arquivo não é um backup compatível
**Solução:** Selecione um arquivo `.json` exportado por esta aplicação

### ❌ "Arquivo muito grande (máximo 10MB)"
**Causa:** Arquivo tem mais de 10MB
**Solução:** Exporte novamente ou comprima o arquivo

### ❌ "Apenas arquivos .json são aceitos"
**Causa:** Tentou importar arquivo com outra extensão
**Solução:** Renomeie para `.json` ou exporte novamente

### ❌ "Erro ao ler o arquivo"
**Causa:** Arquivo JSON corrompido
**Solução:** Tente outro arquivo ou exporte novamente

---

## 📱 Exemplos Práticos

### Exemplo 1: Backup Semanal
```
Segunda-feira: Exportar → gestus-backup-seg.json
Quarta-feira: Exportar → gestus-backup-qua.json
Sexta-feira: Exportar → gestus-backup-sex.json
```

### Exemplo 2: Após Limpar Cache
```
1. Limpou cache acidentalmente
2. Dados desapareceram
3. Abra o arquivo gestus-backup-sex.json
4. Clique em "Selecionar Arquivo"
5. Dados restaurados!
```

### Exemplo 3: Migrate para Novo Computador
```
COMPUTADOR A:
1. Configurações → Backup
2. Clique "Exportar Backup"
3. Arquivo baixado: gestus-backup-1234567890.json

COMPUTADOR B:
1. Configurações → Backup
2. Clique "Selecionar Arquivo"
3. Escolha o arquivo baixado
4. Confirme a importação
5. Todos os dados estão lá!
```

---

## 💾 Recomendações

### Frequência de Backup
- **Uso Casual:** 1x por semana
- **Uso Regular:** 2-3x por semana
- **Uso Intensivo:** 1x diariamente

### Estratégia de Armazenamento
1. **Local Principal:** Computador pessoal
2. **Backup Secundário:** Pendrive ou HD externo
3. **Backup Terciário:** Cloud storage (Google Drive, Dropbox)

### Checklist de Backup
- [ ] Fazer backup regularmente
- [ ] Testar restauração ocasionalmente
- [ ] Manter múltiplas cópias
- [ ] Armazenar em local seguro
- [ ] Documentar locais de backup

---

## ❓ Perguntas Frequentes

### P: Com que frequência devo fazer backup?
**R:** Depende da frequência de uso. Para uso diário, recomenda-se semanal. Para uso ocasional, mensal é suficiente.

### P: Posso importar um backup em outro navegador?
**R:** Sim! Contanto que seja um backup válido da aplicação Gestus, funciona em qualquer navegador ou computador.

### P: E se eu importar um backup errado por engano?
**R:** Você é pedido a confirmar. Se mesmo assim importar, faça um novo export do estado anterior e depois reimporte.

### P: O backup inclui senhas?
**R:** Não inclui senhas armazenadas no navegador (não temos senhas armazenadas localmente). Inclui dados de autenticação da sessão atual.

### P: Posso compartilhar meu backup com alguém?
**R:** Tecnicamente sim, mas não é recomendado pois contém todos os seus dados. Para colaboração, espere futuras Features de compartilhamento.

### P: Qual é o tamanho típico de um backup?
**R:** Varia conforme quantidade de dados. Uma aplicação típica tem 100KB-500KB.

---

## 🔄 Fluxo Completo de Backup

```
┌─────────────────────────────────────────────────────────────┐
│                   SISTEMA DE BACKUP                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  EXPORTAR:                                                   │
│  Dados localStorage → JSON → Arquivo .json → Download      │
│                                                              │
│  IMPORTAR:                                                   │
│  Arquivo .json → Validação → Confirmar → localStorage      │
│                      ↓                                       │
│                   Sucesso?                                   │
│                   ├─ Sim: Recarrega página ✅              │
│                   └─ Não: Mostra erro ❌                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📞 Suporte

Se encontrar problemas com backup/restauração:
1. Verifique se o arquivo é `.json` válido
2. Tente exportar um novo backup
3. Teste em outro navegador
4. Procure mensagem de erro específica acima

---

**Última Atualização:** Abril 2026
**Versão de Backup:** 1.0
