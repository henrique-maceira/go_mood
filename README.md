# GoMood - Seu Rolê Personalizado 🎉

Um sistema inteligente que combina geolocalização, API do Google Places e GPT para sugerir os melhores lugares de entretenimento baseado nas suas preferências.

## ✨ Funcionalidades

- **Geolocalização automática** - Detecta sua localização atual
- **Busca inteligente** - Encontra locais com avaliação > 4.8
- **Categorias expandidas** - Restaurantes, teatros, cinemas, museus, parques, etc.
- **Análise com GPT** - Classifica locais baseado nas suas preferências
- **Filtros personalizados** - Orçamento, distância, tipo de evento
- **Interface moderna** - Design responsivo e intuitivo

## 🚀 Como usar

### 1. Configuração das APIs

#### Google Maps API
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Places API
   - Geocoding API
   - Maps JavaScript API
4. Crie uma chave de API
5. Configure restrições de domínio para segurança

#### OpenAI API
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta ou faça login
3. Gere uma chave de API
4. Configure limites de uso conforme necessário

### 2. Configuração do Projeto

#### Backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` baseado no `env.example`:
```env
GOOGLE_API_KEY=sua_chave_api_do_google_aqui
OPENAI_API_KEY=sua_chave_api_da_openai_aqui
```

#### Frontend
```bash
cd rola-ai-sugest_v1
npm install
```

### 3. Executando o Projeto

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd rola-ai-sugest_v1
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## 🎯 Como funciona

1. **Localização**: O usuário permite acesso à geolocalização ou insere um endereço
2. **Busca**: O sistema busca locais próximos usando a API do Google Places
3. **Filtros**: Aplica filtros de avaliação (> 4.8) e categorias relevantes
4. **Análise**: Envia comentários dos locais para o GPT analisar
5. **Classificação**: GPT classifica cada local como "Ideal", "Aceitável" ou "Não Ideal"
6. **Resultados**: Exibe sugestões personalizadas com justificativas

## 📱 Tipos de Rolê Suportados

- 👨‍👩‍👧‍👦 **Família** - Parques, museus, aquários, zoológicos
- 💕 **Casal** - Restaurantes, cinemas, galerias de arte, spas
- 💪 **Fitness** - Parques, academias, lojas de bicicletas
- 🎉 **Amigos** - Bares, casas noturnas, boliches, parques de diversão
- 🎭 **Cultura** - Museus, galerias de arte, teatros, bibliotecas
- 🏔️ **Aventura** - Parques, pontos turísticos, aquários
- 🧘‍♀️ **Relaxamento** - Spas, parques, salões de beleza

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **APIs**: Google Places, OpenAI GPT-4
- **UI**: Tailwind CSS + Shadcn/ui
- **Geolocalização**: Browser Geolocation API

## 📊 Estrutura do Projeto

```
go_mood/
├── backend/                 # Servidor Node.js
│   ├── index.js            # Servidor principal
│   ├── package.json        # Dependências do backend
│   └── env.example         # Exemplo de variáveis de ambiente
└── rola-ai-sugest_v1/      # Frontend React
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/          # Páginas da aplicação
    │   ├── types/          # Definições TypeScript
    │   └── api.js          # Funções de API
    └── package.json        # Dependências do frontend
```

## 🔧 Configurações Avançadas

### Personalizar Categorias
Edite o arquivo `backend/index.js` para adicionar ou remover categorias de entretenimento.

### Ajustar Filtros
Modifique os critérios de filtragem no backend:
- Avaliação mínima (atualmente 4.8)
- Raio de busca
- Número máximo de resultados

### Customizar Análise GPT
Ajuste o prompt no backend para personalizar como o GPT analisa os locais.

## 🚨 Limitações e Considerações

- **Rate Limits**: Respeite os limites das APIs do Google e OpenAI
- **Custos**: APIs podem gerar custos dependendo do uso
- **Precisão**: Geolocalização depende da precisão do dispositivo
- **Disponibilidade**: Alguns locais podem não ter comentários suficientes

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se as APIs estão configuradas corretamente
2. Confirme se as variáveis de ambiente estão definidas
3. Verifique os logs do console para erros
4. Abra uma issue no repositório

---

Desenvolvido com ❤️ para ajudar você a descobrir experiências incríveis!
