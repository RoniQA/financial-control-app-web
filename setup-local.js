#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando Nova Agro para desenvolvimento local...\n');

// Verificar se Node.js está instalado
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js ${nodeVersion} encontrado`);
} catch (error) {
  console.error('❌ Node.js não encontrado. Instale Node.js 18+ primeiro.');
  process.exit(1);
}

// Verificar se PostgreSQL está rodando
console.log('\n🔍 Verificando PostgreSQL...');
try {
  execSync('psql --version', { encoding: 'utf8' });
  console.log('✅ PostgreSQL encontrado');
} catch (error) {
  console.log('⚠️  PostgreSQL não encontrado. Instale PostgreSQL primeiro.');
  console.log('   Download: https://www.postgresql.org/download/');
}

// Verificar se Redis está rodando
console.log('\n🔍 Verificando Redis...');
try {
  execSync('redis-cli --version', { encoding: 'utf8' });
  console.log('✅ Redis encontrado');
} catch (error) {
  console.log('⚠️  Redis não encontrado. Instale Redis primeiro.');
  console.log('   Download: https://redis.io/download');
}

// Criar arquivo .env para o backend se não existir
const backendEnvPath = path.join(__dirname, 'apps', 'backend', '.env');
const backendEnvExamplePath = path.join(__dirname, 'apps', 'backend', 'env.example');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendEnvExamplePath)) {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    console.log('\n✅ Arquivo .env criado para o backend');
  } else {
    console.log('\n⚠️  Arquivo env.example não encontrado no backend');
  }
} else {
  console.log('\n✅ Arquivo .env já existe no backend');
}

// Criar arquivo .env para o frontend se não existir
const frontendEnvPath = path.join(__dirname, 'apps', 'frontend', '.env');
const frontendEnvExamplePath = path.join(__dirname, 'apps', 'frontend', '.env.example');

if (!fs.existsSync(frontendEnvPath)) {
  if (fs.existsSync(frontendEnvExamplePath)) {
    fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
    console.log('✅ Arquivo .env criado para o frontend');
  } else {
    console.log('⚠️  Arquivo .env.example não encontrado no frontend');
  }
} else {
  console.log('✅ Arquivo .env já existe no frontend');
}

console.log('\n📋 Próximos passos:');
console.log('1. Configure as variáveis de ambiente nos arquivos .env');
console.log('2. Crie o banco de dados PostgreSQL:');
console.log('   createdb nova_agro');
console.log('3. Execute as migrações:');
console.log('   npm run db:migrate');
console.log('4. Popule com dados de exemplo:');
console.log('   npm run db:seed');
console.log('5. Inicie o desenvolvimento:');
console.log('   npm run dev');

console.log('\n🎉 Configuração concluída!');

