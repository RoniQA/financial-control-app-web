# 🚀 Guia de Deploy para Produção - Nova Agro

## 📋 Pré-requisitos

### **Servidor**
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Mínimo 4GB (Recomendado 8GB+)
- **CPU**: Mínimo 2 cores (Recomendado 4+ cores)
- **Disco**: Mínimo 50GB SSD
- **Rede**: Porta 80, 443, 3000, 3001 abertas

### **Software**
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **Nginx**: 1.18+ (opcional, já incluído no Docker)

## 🔧 Configuração Inicial

### **1. Preparar o Servidor**

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sessão
exit
```

### **2. Clonar o Repositório**

```bash
# Clonar repositório
git clone https://github.com/RoniQA/financial-control-app-web.git
cd financial-control-app-web

# Mudar para branch main (produção)
git checkout main
git pull origin main
```

### **3. Configurar Variáveis de Ambiente**

```bash
# Copiar arquivo de exemplo
cp env.prod.example .env.prod

# Editar configurações
nano .env.prod
```

**⚠️ IMPORTANTE**: Altere TODAS as senhas e secrets no arquivo `.env.prod`!

### **4. Configurar SSL/TLS (Recomendado)**

```bash
# Criar diretório para certificados
mkdir -p nginx/ssl

# Copiar seus certificados SSL
cp /path/to/your/cert.pem nginx/ssl/
cp /path/to/your/key.pem nginx/ssl/

# Ou usar Let's Encrypt (recomendado)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

## 🚀 Deploy

### **Deploy Automático (Recomendado)**

```bash
# Tornar script executável
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### **Deploy Manual**

```bash
# 1. Parar containers existentes
docker-compose -f docker-compose.prod.yml down

# 2. Construir imagens
docker-compose -f docker-compose.prod.yml build

# 3. Iniciar serviços
docker-compose -f docker-compose.prod.yml up -d

# 4. Executar migrações
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy

# 5. Verificar status
docker-compose -f docker-compose.prod.yml ps
```

## 🔍 Verificação

### **Verificar Serviços**

```bash
# Status dos containers
docker-compose -f docker-compose.prod.yml ps

# Logs dos serviços
docker-compose -f docker-compose.prod.yml logs -f

# Testar endpoints
curl http://localhost:3000          # Frontend
curl http://localhost:3001/api/health  # Backend API
```

### **Verificar Banco de Dados**

```bash
# Conectar ao PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U nova_agro_user -d nova_agro_prod

# Verificar tabelas
\dt

# Sair
\q
```

## 📊 Monitoramento

### **Logs**

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs de um serviço específico
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### **Métricas**

```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h

# Uso de memória
free -h
```

## 🔄 Backup e Restore

### **Backup do Banco de Dados**

```bash
# Backup manual
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U nova_agro_user nova_agro_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup automático (cron)
echo "0 2 * * * cd /path/to/nova-agro && docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U nova_agro_user nova_agro_prod > backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql" | crontab -
```

### **Restore do Banco de Dados**

```bash
# Restore
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U nova_agro_user -d nova_agro_prod < backup_20241202_143000.sql
```

## 🔧 Manutenção

### **Atualizações**

```bash
# 1. Fazer backup
./backup.sh

# 2. Parar serviços
docker-compose -f docker-compose.prod.yml down

# 3. Atualizar código
git pull origin main

# 4. Reconstruir e iniciar
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 5. Executar migrações
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy
```

### **Limpeza**

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -f

# Remover volumes não utilizados
docker volume prune -f

# Limpeza completa (cuidado!)
docker system prune -a -f
```

## 🚨 Troubleshooting

### **Problemas Comuns**

**1. Container não inicia**
```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs container_name

# Verificar configurações
docker-compose -f docker-compose.prod.yml config
```

**2. Banco de dados não conecta**
```bash
# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Verificar logs
docker-compose -f docker-compose.prod.yml logs postgres
```

**3. Frontend não carrega**
```bash
# Verificar se Nginx está rodando
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Verificar logs
docker-compose -f docker-compose.prod.yml logs nginx
```

**4. API não responde**
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/health

# Verificar logs
docker-compose -f docker-compose.prod.yml logs backend
```

### **Comandos de Emergência**

```bash
# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Reiniciar tudo
docker-compose -f docker-compose.prod.yml restart

# Reconstruir tudo
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Suporte

### **Logs Importantes**

```bash
# Logs do sistema
journalctl -u docker

# Logs da aplicação
docker-compose -f docker-compose.prod.yml logs

# Logs do Nginx
docker-compose -f docker-compose.prod.yml logs nginx
```

### **Informações do Sistema**

```bash
# Versões
docker --version
docker-compose --version
git --version

# Recursos
free -h
df -h
lscpu
```

---

## 🎯 Checklist de Produção

- [ ] Servidor configurado com requisitos mínimos
- [ ] Docker e Docker Compose instalados
- [ ] Repositório clonado e na branch main
- [ ] Arquivo `.env.prod` configurado com senhas seguras
- [ ] Certificados SSL configurados
- [ ] Deploy executado com sucesso
- [ ] Todos os serviços rodando
- [ ] Banco de dados migrado
- [ ] Backup configurado
- [ ] Monitoramento configurado
- [ ] Testes de funcionalidade realizados
- [ ] Documentação atualizada

**🎉 Sua aplicação Nova Agro está pronta para produção!**
