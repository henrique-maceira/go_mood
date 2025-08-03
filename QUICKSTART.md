# 🚀 Guia Rápido - GoMood

## Configuração em 5 minutos

### 1. Instalar dependências
```bash
npm run install-all
```

### 2. Configurar APIs
Crie o arquivo `backend/.env`:
```env
GOOGLE_API_KEY=sua_chave_api_do_google_aqui
OPENAI_API_KEY=sua_chave_api_da_openai_aqui
```

### 3. Executar o projeto
```bash
npm run dev
```

### 4. Acessar
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔑 Como obter as APIs

### Google Maps API
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto
3. Ative: Places API, Geocoding API, Maps JavaScript API
4. Crie uma chave de API

### OpenAI API
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Faça login/cadastro
3. Gere uma chave de API

## 🎯 Teste rápido

1. Abra http://localhost:5173
2. Clique em "GPS" para usar sua localização
3. Selecione orçamento e tipo de rolê
4. Clique em "Encontrar Sugestões"
5. Veja as sugestões personalizadas!

## 🆘 Problemas comuns

**Erro de CORS**: Certifique-se de que o backend está rodando na porta 3000

**Erro de API**: Verifique se as chaves estão corretas no arquivo `.env`

**Geolocalização não funciona**: Permita acesso à localização no navegador

**Nenhuma sugestão**: Tente aumentar o tempo de deslocamento ou ajustar o orçamento 