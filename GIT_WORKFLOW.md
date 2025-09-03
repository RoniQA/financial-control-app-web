# 🌿 Git Workflow - Nova Agro

## 📋 Estrutura de Branches

### **Branches Principais**
- **`main`** - Branch de produção (estável, sempre deployável)
- **`develop`** - Branch de desenvolvimento (integração de features)

### **Branches de Suporte**
- **`feature/*`** - Branches para novas funcionalidades
- **`hotfix/*`** - Branches para correções urgentes em produção
- **`release/*`** - Branches para preparação de releases

## 🔄 Fluxo de Trabalho

### **1. Desenvolvimento de Novas Features**

```bash
# 1. Criar branch de feature a partir da develop
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature

# 2. Desenvolver a feature
# ... fazer commits ...

# 3. Enviar para o repositório
git push -u origin feature/nome-da-feature

# 4. Criar Pull Request para develop
# 5. Após aprovação, merge na develop
# 6. Deletar branch de feature
```

### **2. Preparação de Release**

```bash
# 1. Criar branch de release a partir da develop
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# 2. Preparar release (versioning, changelog, etc.)
# ... fazer commits ...

# 3. Merge para main e develop
git checkout main
git merge release/1.0.0
git tag v1.0.0
git push origin main --tags

git checkout develop
git merge release/1.0.0
git push origin develop

# 4. Deletar branch de release
```

### **3. Hotfix em Produção**

```bash
# 1. Criar branch de hotfix a partir da main
git checkout main
git pull origin main
git checkout -b hotfix/correcao-urgente

# 2. Fazer correção
# ... fazer commits ...

# 3. Merge para main e develop
git checkout main
git merge hotfix/correcao-urgente
git tag v1.0.1
git push origin main --tags

git checkout develop
git merge hotfix/correcao-urgente
git push origin develop

# 4. Deletar branch de hotfix
```

## 📝 Convenções de Commits

### **Formato**
```
tipo(escopo): descrição breve

Descrição detalhada (opcional)

- Item 1
- Item 2
```

### **Tipos**
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação, sem mudança de código
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Tarefas de manutenção

### **Exemplos**
```bash
git commit -m "feat(auth): implementar login com JWT"
git commit -m "fix(orders): corrigir cálculo de total do pedido"
git commit -m "docs: atualizar README com instruções de instalação"
```

## 🚀 Deploy

### **Produção (main)**
- Deploy automático quando há push na `main`
- Sempre estável e testado
- Versões taggeadas

### **Desenvolvimento (develop)**
- Deploy para ambiente de staging
- Para testes e validação
- Integração contínua

## ⚠️ Regras Importantes

1. **Nunca commitar diretamente na `main`**
2. **Sempre criar Pull Requests para merge**
3. **Manter a `develop` sempre atualizada**
4. **Usar nomes descritivos para branches**
5. **Fazer commits pequenos e frequentes**
6. **Sempre testar antes de fazer merge**

## 🔧 Comandos Úteis

```bash
# Ver status atual
git status

# Ver branches
git branch -a

# Mudar de branch
git checkout nome-da-branch

# Criar e mudar para nova branch
git checkout -b nova-branch

# Ver histórico de commits
git log --oneline

# Ver diferenças
git diff

# Desfazer último commit (mantendo mudanças)
git reset --soft HEAD~1

# Desfazer último commit (perdendo mudanças)
git reset --hard HEAD~1
```

## 📚 Recursos Adicionais

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
