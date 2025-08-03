const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do projeto...\n');

// Verificar se os arquivos principais existem
const filesToCheck = [
  'backend/index.js',
  'backend/package.json',
  'backend/env.example',
  'rola-ai-sugest_v1/src/api.ts',
  'rola-ai-sugest_v1/src/types/index.ts',
  'rola-ai-sugest_v1/src/components/PreferencesForm.tsx',
  'rola-ai-sugest_v1/src/pages/Index.tsx',
  'rola-ai-sugest_v1/package.json',
  'rola-ai-sugest_v1/tsconfig.json',
  'rola-ai-sugest_v1/vite.config.ts',
  'package.json',
  'README.md',
  'QUICKSTART.md'
];

console.log('📁 Verificando arquivos principais:');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
  }
});

// Verificar se o arquivo .env existe no backend
console.log('\n🔐 Verificando configuração de ambiente:');
if (fs.existsSync('backend/.env')) {
  console.log('✅ backend/.env existe');
} else {
  console.log('⚠️  backend/.env não existe - você precisa criar baseado no env.example');
}

// Verificar dependências do backend
console.log('\n📦 Verificando dependências do backend:');
try {
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const requiredDeps = ['express', 'axios', 'cors', 'dotenv'];
  requiredDeps.forEach(dep => {
    if (backendPackage.dependencies && backendPackage.dependencies[dep]) {
      console.log(`✅ ${dep}: ${backendPackage.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - FALTANDO`);
    }
  });
} catch (error) {
  console.log('❌ Erro ao ler package.json do backend');
}

// Verificar dependências do frontend
console.log('\n📦 Verificando dependências do frontend:');
try {
  const frontendPackage = JSON.parse(fs.readFileSync('rola-ai-sugest_v1/package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'lucide-react'];
  requiredDeps.forEach(dep => {
    if (frontendPackage.dependencies && frontendPackage.dependencies[dep]) {
      console.log(`✅ ${dep}: ${frontendPackage.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - FALTANDO`);
    }
  });
} catch (error) {
  console.log('❌ Erro ao ler package.json do frontend');
}

console.log('\n🎯 Próximos passos:');
console.log('1. Execute: npm run install-all');
console.log('2. Crie o arquivo backend/.env com suas chaves de API');
console.log('3. Execute: npm run dev');
console.log('4. Acesse: http://localhost:5173');

console.log('\n✨ Verificação concluída!'); 