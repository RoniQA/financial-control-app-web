# 🚀 Guia de Deploy Rápido - Nova Agro

## 📋 **Opções de Deploy**

### **Opção 1: Servidor Próprio (Recomendado)**

#### **1.1. Preparar Servidor**
```bash
# Conectar ao seu servidor via SSH
ssh usuario@seu-servidor.com

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### **1.2. Deploy da Aplicação**
```bash
# Clonar repositório
git clone https://github.com/RoniQA/financial-control-app-web.git
cd financial-control-app-web

# Configurar ambiente
cp env.prod.example .env.prod
nano .env.prod  # Editar com suas configurações

# Deploy automático
chmod +x deploy.sh
./deploy.sh
```

#### **1.3. Configurar Acesso Externo**
```bash
# Abrir portas no firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 3001

# Verificar se está funcionando
curl http://localhost:3000
curl http://localhost:3001/api/health
```

**🌐 URL de Acesso:** `http://SEU-IP-SERVIDOR:3000`

---

### **Opção 2: Serviços de Cloud (Mais Fácil)**

#### **2.1. DigitalOcean (Recomendado)**
1. **Criar Droplet:**
   - Ubuntu 22.04
   - 4GB RAM, 2 CPU
   - $24/mês

2. **Configurar:**
   ```bash
   # Conectar via SSH
   ssh root@SEU-IP-DROPLET
   
   # Seguir passos da Opção 1
   ```

3. **URL:** `http://SEU-IP-DROPLET:3000`

#### **2.2. AWS EC2**
1. **Criar instância:**
   - Ubuntu Server 22.04
   - t3.medium
   - Configurar Security Groups (portas 80, 443, 3000, 3001)

2. **Deploy:**
   ```bash
   # Conectar via SSH
   ssh -i sua-chave.pem ubuntu@SEU-IP-EC2
   
   # Seguir passos da Opção 1
   ```

3. **URL:** `http://SEU-IP-EC2:3000`

#### **2.3. Google Cloud Platform**
1. **Criar VM:**
   - Ubuntu 22.04
   - e2-medium
   - Configurar Firewall (portas 80, 443, 3000, 3001)

2. **Deploy:**
   ```bash
   # Conectar via SSH
   gcloud compute ssh sua-instancia --zone=sua-zona
   
   # Seguir passos da Opção 1
   ```

3. **URL:** `http://IP-EXTERNO:3000`

---

### **Opção 3: Serviços Gerenciados**

#### **3.1. Railway**
1. **Conectar GitHub:**
   - Acesse [railway.app](https://railway.app)
   - Conecte seu repositório GitHub
   - Deploy automático

2. **URL:** `https://seu-projeto.railway.app`

#### **3.2. Render**
1. **Deploy:**
   - Acesse [render.com](https://render.com)
   - Conecte repositório
   - Configure variáveis de ambiente

2. **URL:** `https://seu-projeto.onrender.com`

#### **3.3. Heroku**
1. **Deploy:**
   - Instalar Heroku CLI
   - `heroku create sua-app`
   - `git push heroku main`

2. **URL:** `https://sua-app.herokuapp.com`

---

## 🔧 **Configuração de Domínio (Opcional)**

### **Com Domínio Próprio:**
```bash
# 1. Configurar DNS
# A record: seu-dominio.com -> IP-DO-SERVIDOR

# 2. Configurar SSL com Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d seu-dominio.com

# 3. Atualizar nginx
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem nginx/ssl/key.pem

# 4. Reiniciar serviços
docker-compose -f docker-compose.prod.yml restart nginx
```

**🌐 URL Final:** `https://seu-dominio.com`

---

## 📱 **Teste de Acesso**

### **Verificar se está funcionando:**
```bash
# Testar localmente
curl http://localhost:3000
curl http://localhost:3001/api/health

# Testar externamente
curl http://SEU-IP:3000
curl http://SEU-IP:3001/api/health
```

### **Credenciais de Teste:**
- **Email:** admin@novaagro.com
- **Senha:** admin123

---

## 🚨 **Problemas Comuns**

### **1. Porta não acessível externamente:**
```bash
# Verificar firewall
sudo ufw status
sudo ufw allow 3000

# Verificar se Docker está expondo a porta
docker-compose -f docker-compose.prod.yml ps
```

### **2. Aplicação não inicia:**
```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs

# Verificar configurações
docker-compose -f docker-compose.prod.yml config
```

### **3. Banco de dados não conecta:**
```bash
# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Verificar logs do banco
docker-compose -f docker-compose.prod.yml logs postgres
```

---

## 💰 **Custos Estimados**

| Serviço | Custo Mensal | Facilidade |
|---------|--------------|------------|
| **Servidor Próprio** | $0-50 | ⭐⭐⭐ |
| **DigitalOcean** | $24 | ⭐⭐⭐⭐⭐ |
| **AWS EC2** | $30-50 | ⭐⭐⭐⭐ |
| **Google Cloud** | $25-45 | ⭐⭐⭐⭐ |
| **Railway** | $5-20 | ⭐⭐⭐⭐⭐ |
| **Render** | $7-25 | ⭐⭐⭐⭐⭐ |
| **Heroku** | $7-25 | ⭐⭐⭐⭐⭐ |

---

## 🎯 **Recomendação**

**Para começar rapidamente:**
1. **Use Railway ou Render** (mais fácil)
2. **Ou DigitalOcean** (mais controle)

**Para produção séria:**
1. **Servidor próprio** com domínio
2. **AWS/GCP** com load balancer

---

## 📞 **Precisa de Ajuda?**

Se tiver problemas durante o deploy:
1. **Verifique os logs:** `docker-compose -f docker-compose.prod.yml logs`
2. **Teste localmente primeiro**
3. **Verifique as portas do firewall**
4. **Confirme se o IP está correto**

**🎉 Boa sorte com o deploy!**
