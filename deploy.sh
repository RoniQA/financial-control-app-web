#!/bin/bash

# ===========================================
# NOVA AGRO - SCRIPT DE DEPLOY PARA PRODUÇÃO
# ===========================================

set -e  # Exit on any error

echo "🚀 Iniciando deploy da Nova Agro para produção..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    print_error "Arquivo .env.prod não encontrado!"
    print_warning "Copie o arquivo env.prod.example para .env.prod e configure as variáveis"
    exit 1
fi

# Load environment variables
print_status "Carregando variáveis de ambiente..."
export $(cat .env.prod | grep -v '^#' | xargs)

# Check if Docker is running
print_status "Verificando se o Docker está rodando..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker não está rodando!"
    exit 1
fi

# Stop existing containers
print_status "Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Remove old images (optional)
print_status "Removendo imagens antigas..."
docker system prune -f

# Build new images
print_status "Construindo novas imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
print_status "Iniciando serviços..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Aguardando serviços ficarem prontos..."
sleep 30

# Check if services are healthy
print_status "Verificando saúde dos serviços..."

# Check PostgreSQL
if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U nova_agro_user -d nova_agro_prod > /dev/null 2>&1; then
    print_success "PostgreSQL está rodando"
else
    print_error "PostgreSQL não está respondendo"
    exit 1
fi

# Check Redis
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis está rodando"
else
    print_error "Redis não está respondendo"
    exit 1
fi

# Check Backend
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_success "Backend está rodando"
else
    print_error "Backend não está respondendo"
    exit 1
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend está rodando"
else
    print_error "Frontend não está respondendo"
    exit 1
fi

# Run database migrations
print_status "Executando migrações do banco de dados..."
docker-compose -f docker-compose.prod.yml exec -T backend npm run prisma:deploy

# Show running containers
print_status "Containers em execução:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
print_status "Últimas linhas dos logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

print_success "Deploy concluído com sucesso! 🎉"
print_status "Acesse a aplicação em: http://localhost:3000"
print_status "API disponível em: http://localhost:3001/api"
print_status "Documentação da API: http://localhost:3001/api/docs"

# Show useful commands
echo ""
print_status "Comandos úteis:"
echo "  Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Parar serviços: docker-compose -f docker-compose.prod.yml down"
echo "  Reiniciar serviços: docker-compose -f docker-compose.prod.yml restart"
echo "  Acessar banco: docker-compose -f docker-compose.prod.yml exec postgres psql -U nova_agro_user -d nova_agro_prod"
echo "  Backup do banco: docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U nova_agro_user nova_agro_prod > backup.sql"
