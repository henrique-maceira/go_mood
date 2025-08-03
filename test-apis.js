const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('🧪 Testando APIs do GoMood...\n');

async function testGooglePlaces() {
  console.log('🔍 Testando Google Places API...');
  
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: {
        location: "-23.5505,-46.6333", // São Paulo
        radius: 5000,
        type: "restaurant",
        key: GOOGLE_API_KEY
      }
    });
    
    console.log('✅ Google Places API funcionando!');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Resultados: ${response.data.results?.length || 0}`);
    
    if (response.data.results && response.data.results.length > 0) {
      console.log('   Exemplo de resultado:');
      const exemplo = response.data.results[0];
      console.log(`   - Nome: ${exemplo.name}`);
      console.log(`   - Rating: ${exemplo.rating}`);
      console.log(`   - Tipos: ${exemplo.types?.join(', ')}`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erro na Google Places API:');
    console.log(`   ${error.response?.data?.error_message || error.message}`);
    return false;
  }
}

async function testOpenAI() {
  console.log('\n🤖 Testando OpenAI API...');
  
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o",
      messages: [
        { role: "user", content: "Responda apenas com 'OK' se está funcionando." }
      ],
      max_tokens: 10
    }, {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });
    
    console.log('✅ OpenAI API funcionando!');
    console.log(`   Resposta: ${response.data.choices[0].message.content}`);
    return true;
  } catch (error) {
    console.log('❌ Erro na OpenAI API:');
    console.log(`   ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testBackend() {
  console.log('\n🌐 Testando Backend...');
  
  try {
    const response = await axios.get("http://localhost:3000/api/test");
    console.log('✅ Backend funcionando!');
    console.log('   Resposta:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Erro no Backend:');
    console.log(`   ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('📋 Verificando variáveis de ambiente...');
  console.log(`   GOOGLE_API_KEY: ${GOOGLE_API_KEY ? '✅ Configurada' : '❌ Não configurada'}`);
  console.log(`   OPENAI_API_KEY: ${OPENAI_API_KEY ? '✅ Configurada' : '❌ Não configurada'}`);
  
  if (!GOOGLE_API_KEY || !OPENAI_API_KEY) {
    console.log('\n⚠️ Configure as variáveis de ambiente no arquivo backend/.env');
    return;
  }
  
  const googleOk = await testGooglePlaces();
  const openaiOk = await testOpenAI();
  const backendOk = await testBackend();
  
  console.log('\n📊 Resumo dos testes:');
  console.log(`   Google Places: ${googleOk ? '✅' : '❌'}`);
  console.log(`   OpenAI: ${openaiOk ? '✅' : '❌'}`);
  console.log(`   Backend: ${backendOk ? '✅' : '❌'}`);
  
  if (googleOk && openaiOk && backendOk) {
    console.log('\n🎉 Todas as APIs estão funcionando!');
  } else {
    console.log('\n⚠️ Algumas APIs não estão funcionando. Verifique as configurações.');
  }
}

runTests().catch(console.error); 