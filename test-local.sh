#!/bin/bash

# ===========================================
# NOVA AGRO - TESTE LOCAL
# ===========================================

echo "🧪 Testando aplicação localmente..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
print_status "Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker não está rodando!"
    exit 1
fi
print_success "Docker está rodando"

# Parar containers existentes
print_status "Parando containers existentes..."
docker-compose down 2>/dev/null || true

# Iniciar serviços de desenvolvimento
print_status "Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
print_status "Aguardando serviços ficarem prontos..."
sleep 30

# Testar endpoints
print_status "Testando endpoints..."

# Testar Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend está rodando em http://localhost:3000"
else
    print_error "Frontend não está respondendo"
fi

# Testar Backend
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_success "Backend está rodando em http://localhost:3001"
else
    print_error "Backend não está respondendo"
fi

# Testar Banco de Dados
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_success "PostgreSQL está rodando"
else
    print_error "PostgreSQL não está respondendo"
fi

# Testar Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis está rodando"
else
    print_error "Redis não está respondendo"
fi

echo ""
print_success "Teste concluído!"
echo ""
echo "🌐 URLs de acesso:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api/docs"
echo ""
echo "👤 Credenciais de teste:"
echo "  Email: admin@novaagro.com"
echo "  Senha: admin123"
echo ""
echo "📊 Status dos containers:"
docker-compose ps
