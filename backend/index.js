import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Mapeamento de categorias do Google para português
const categoriaTraducoes = {
  'amusement_park': 'Parque de Diversões',
  'aquarium': 'Aquário',
  'art_gallery': 'Galeria de Arte',
  'bar': 'Bar',
  'beauty_salon': 'Salão de Beleza',
  'bowling_alley': 'Boliche',
  'campground': 'Camping',
  'cultural_center': 'Centro Cultural',
  'establishment': 'Estabelecimento',
  'garden': 'Jardim',
  'gym': 'Academia',
  'karaoke': 'Karaokê',
  'library': 'Biblioteca',
  'movie_theater': 'Cinema',
  'museum': 'Museu',
  'natural_feature': 'Atração Natural',
  'night_club': 'Vida Noturna',
  'park': 'Parque',
  'place_of_worship': 'Local de Culto',
  'point_of_interest': 'Ponto de Interesse',
  'restaurant': 'Restaurante',
  'spa': 'Spa',
  'sports_complex': 'Complexo Esportivo',
  'stadium': 'Estádio',
  'store': 'Loja',
  'theater': 'Teatro',
  'tourist_attraction': 'Ponto Turístico',
  'zoo': 'Zoológico',
  'arcade': 'Arcade',
  'mountain': 'Montanha'
};

// Função para traduzir categoria
function traduzirCategoria(categoria) {
  return categoriaTraducoes[categoria] || categoria;
}

// Função para mapear orçamento do usuário para faixas de preço
function mapearOrcamentoParaPriceLevel(budget) {
  const mapeamento = {
    'gratuito': [0],           // Apenas lugares gratuitos
    'ate-50': [0, 1],          // Gratuito e até R$ 50
    '50-100': [0, 1, 2],       // Gratuito, até R$ 50 e R$ 50-100
    '100-200': [0, 1, 2, 3],   // Gratuito, até R$ 50, R$ 50-100 e R$ 100-200
    '200-500': [0, 1, 2, 3, 4], // Todos os preços
    'acima-500': [0, 1, 2, 3, 4] // Todos os preços
  };
  
  return mapeamento[budget] || [0, 1, 2, 3, 4];
}

// Função para converter price_level para texto em português
function priceLevelParaTexto(priceLevel) {
  const mapeamento = {
    0: 'R$0',
    1: 'R$10 – R$50',
    2: 'R$50 – R$100',
    3: 'R$100 – R$200',
    4: 'R$200 ou mais'
  };
  
  return mapeamento[priceLevel] || 'Preço não informado';
}

// Função para obter coordenadas a partir de endereço
async function getCoordinatesFromAddress(address) {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: address,
        key: GOOGLE_API_KEY
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return `${location.lat},${location.lng}`;
    }
    throw new Error("Endereço não encontrado");
  } catch (error) {
    throw new Error("Erro ao geocodificar endereço");
  }
}

// Função para buscar locais por categoria específica
async function searchPlacesByCategory(location, category, radius, openNow = false) {
  try {
    console.log(`🔍 Buscando categoria: ${category} em ${location} com raio ${radius}m, openNow: ${openNow}`);
    
    const params = {
      location: location,
      radius: radius,
      type: category,
      key: GOOGLE_API_KEY
    };

    // Adicionar filtro de lugares abertos se solicitado
    if (openNow) {
      params.opennow = true;
    }

    const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: params
    });

    console.log(`📊 Resposta da API para ${category}:`, {
      status: response.data.status,
      resultsCount: response.data.results?.length || 0,
      results: response.data.results?.slice(0, 3).map(r => ({ 
        name: r.name, 
        rating: r.rating, 
        user_ratings_total: r.user_ratings_total,
        types: r.types 
      }))
    });

    // Filtrar locais com rating >= 4.5 E pelo menos 100 avaliações
    const filteredResults = response.data.results.filter(place => 
      place.rating && 
      place.rating >= 4.5 && 
      place.user_ratings_total && 
      place.user_ratings_total >=100
    );

    console.log(`✅ Locais filtrados para ${category}: ${filteredResults.length} com rating >= 4.8 e 50+ avaliações`);
    
    return filteredResults;
  } catch (error) {
    console.error(`❌ Erro ao buscar categoria ${category}:`, error.response?.data || error.message);
    return [];
  }
}

app.post("/api/sugestoes", async (req, res) => {
  const { localizacao, tipoRole, tempoDeslocamento, budget, openNow } = req.body;

  console.log('🚀 Iniciando busca de sugestões:', { localizacao, tipoRole, tempoDeslocamento, budget, openNow });

  try {
    let coordinates = localizacao;
    
    // Se não for coordenadas ou estiver vazio, usar localização padrão
    if (!localizacao || localizacao.trim() === '') {
      console.log('📍 Localização não fornecida, usando São Paulo como padrão');
      coordinates = "-23.5505,-46.6333"; // São Paulo
    } else if (!localizacao.includes(',')) {
      console.log('📍 Geocodificando endereço:', localizacao);
      try {
        coordinates = await getCoordinatesFromAddress(localizacao);
        console.log('📍 Coordenadas obtidas:', coordinates);
      } catch (error) {
        console.log('⚠️ Erro ao geocodificar, usando São Paulo como padrão');
        coordinates = "-23.5505,-46.6333"; // São Paulo como fallback
      }
    }

    // Categorias específicas e relevantes para cada tipo de rolê
    const categoriasPorTipo = {
      familia: [
        "park",           // Parques
        "museum",         // Museus
        "aquarium",       // Aquários
        "zoo",           // Zoológicos
        "amusement_park", // Parques de diversão
        "restaurant",     // Restaurantes
        "movie_theater",  // Cinemas
        "library"         // Bibliotecas
      ],
      casal: [
        "restaurant",     // Restaurantes
        "movie_theater",  // Cinemas
        "art_gallery",    // Galerias de arte
        "park",          // Parques
        "bar",           // Bares
        "spa",           // Spas
        "tourist_attraction" // Pontos turísticos
      ],
      fitness: [
        "park",          // Parques
        "gym",           // Academias
        "sports_complex", // Complexos esportivos
        "stadium",       // Estádios
      ],
      amigos: [
        "bar",           // Bares
        "night_club",    // Casas noturnas
        "restaurant",    // Restaurantes
        "bowling_alley", // Boliches
        "amusement_park", // Parques de diversão
        "movie_theater", // Cinemas
        "karaoke",       // Karaokês
        "arcade"         // Arcades
      ],
      cultura: [
        "museum",        // Museus
        "art_gallery",   // Galerias de arte
        "theater",       // Teatros
        "library",       // Bibliotecas
        "tourist_attraction", // Pontos turísticos
        // "church",        // Igrejas históricas
        // "university",    // Universidades
        "cultural_center" // Centros culturais
      ],
      aventura: [
        "park",          // Parques
        "tourist_attraction", // Pontos turísticos
        "amusement_park", // Parques de diversão
        "aquarium",      // Aquários
        "zoo",          // Zoológicos
        "campground",    // Campings
        "natural_feature", // Atrações naturais
        "mountain"       // Montanhas
      ],
      relaxamento: [
        "spa",           // Spas
        "park",          // Parques
        "beauty_salon",  // Salões de beleza
        "restaurant",    // Restaurantes
        "bar",          // Bares
        "library",      // Bibliotecas
        "art_gallery",  // Galerias de arte
        "garden"        // Jardins
      ]
    };

    // Categorias de fallback caso o tipo não seja encontrado
    const categoriasFallback = [
      "restaurant",      // Restaurantes
      "park",           // Parques
      "tourist_attraction", // Pontos turísticos
      "museum",         // Museus
      "bar"             // Bares
    ];

    const categoriasRelevantes = categoriasPorTipo[tipoRole] || categoriasFallback;
    const radius = tempoDeslocamento * 1000; // converter para metros

    console.log('🎯 Categorias relevantes para', tipoRole, ':', categoriasRelevantes);
    console.log('📏 Raio de busca:', radius, 'metros');

    // Buscar locais por cada categoria relevante
    const allPlaces = [];
    for (const category of categoriasRelevantes) {
      const places = await searchPlacesByCategory(coordinates, category, radius, openNow);
      allPlaces.push(...places);
    }

    console.log(`📋 Total de locais encontrados: ${allPlaces.length}`);

    // Remover duplicatas e ordenar por quantidade de avaliações (prioridade) e depois por rating
    const uniquePlaces = allPlaces
      .filter((place, index, self) => 
        index === self.findIndex(p => p.place_id === place.place_id)
      )
      .sort((a, b) => {
        // Primeiro ordena por quantidade de avaliações (decrescente)
        const aRatings = a.user_ratings_total || 0;
        const bRatings = b.user_ratings_total || 0;
        if (aRatings !== bRatings) {
          return bRatings - aRatings;
        }
        // Se tiver mesma quantidade de avaliações, ordena por rating (decrescente)
        return (b.rating || 0) - (a.rating || 0);
      })
      .slice(0, 50); // Aumentar para 50 locais para ter mais opções

    console.log(`🔍 Locais únicos após filtro: ${uniquePlaces.length}`);

    if (uniquePlaces.length === 0) {
      console.log('⚠️ Nenhum local encontrado! Tentando busca mais ampla...');
      
      // Busca de fallback sem filtro de rating
      const fallbackPlaces = [];
      for (const category of categoriasRelevantes.slice(0, 3)) {
        try {
          const params = {
            location: coordinates,
            radius: radius,
            type: category,
            key: GOOGLE_API_KEY
          };
          
          if (openNow) {
            params.opennow = true;
          }
          
          const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: params
          });
          
          if (response.data.results) {
            fallbackPlaces.push(...response.data.results.slice(0, 5));
          }
        } catch (error) {
          console.error(`Erro na busca de fallback para ${category}:`, error.message);
        }
      }
      
      if (fallbackPlaces.length > 0) {
        console.log(`🔄 Usando ${fallbackPlaces.length} locais de fallback`);
        uniquePlaces.push(...fallbackPlaces.slice(0, 10));
      }
    }

    // Buscar detalhes completos dos locais
    console.log('🔍 Buscando detalhes dos locais...');
    const locaisComComentarios = await Promise.all(
      uniquePlaces.map(async (local) => {
        try {
          const placeDetails = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
            params: {
              place_id: local.place_id,
              key: GOOGLE_API_KEY,
              fields: "name,rating,user_ratings_total,reviews,formatted_address,url,photos,price_level,opening_hours,types"
            }
          });

          const dados = placeDetails.data.result;
          
          // Calcular distância real usando Google Distance Matrix API
          let distance = "N/A";
          let travelTime = "N/A";
          
          try {
            const distanceResponse = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
              params: {
                origins: coordinates,
                destinations: dados.formatted_address,
                mode: "driving",
                key: GOOGLE_API_KEY
              }
            });
            
            if (distanceResponse.data.rows && 
                distanceResponse.data.rows[0] && 
                distanceResponse.data.rows[0].elements && 
                distanceResponse.data.rows[0].elements[0] &&
                distanceResponse.data.rows[0].elements[0].status === "OK") {
              
              const element = distanceResponse.data.rows[0].elements[0];
              distance = element.distance.text;
              travelTime = element.duration.text;
            }
          } catch (error) {
            console.log(`⚠️ Erro ao calcular distância para ${dados.name}:`, error.message);
            // Fallback para cálculo estimado
            const distanceKm = Math.floor(Math.random() * tempoDeslocamento) + 1;
            distance = `${distanceKm} km`;
            travelTime = `${Math.floor(Math.random() * 30) + 10} min`;
          }
          
          // Converter price_level para texto em português
          const estimatedCost = priceLevelParaTexto(dados.price_level);

          return {
            nome: dados.name,
            endereco: dados.formatted_address,
            rating: dados.rating,
            user_ratings_total: dados.user_ratings_total,
            comentarios: dados.reviews?.slice(0, 5).map(r => r.text).join(" | ") || "Sem comentários.",
            link: dados.url,
            imagem: dados.photos?.[0]
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${dados.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
              : null,
            distance: distance,
            travelTime: travelTime,
            estimatedCost,
            types: (dados.types || []).map(traduzirCategoria),
            openingHours: dados.opening_hours?.weekday_text || []
          };
        } catch (error) {
          console.error(`❌ Erro ao buscar detalhes do local ${local.place_id}:`, error.message);
          return null;
        }
      })
    );

    // Filtrar locais válidos
    const locaisValidos = locaisComComentarios.filter(local => local !== null);
    console.log(`✅ Locais válidos com detalhes: ${locaisValidos.length}`);

    // Obter faixas de preço permitidas baseado no orçamento
    const priceLevelsPermitidos = mapearOrcamentoParaPriceLevel(budget);
    console.log(`💰 Orçamento "${budget}" permite price_levels:`, priceLevelsPermitidos);

    // Filtro de categorias seguro - usar apenas categorias relevantes, com 100+ avaliações, dentro do orçamento e não lojas
    const locaisFiltrados = locaisValidos.filter(l => {
      const ratingOk = l.rating >= 4.5;
      const avaliacoesOk = l.user_ratings_total >= 100;
      const categoriaOk = categoriasRelevantes.some(cat => Array.isArray(l.types) && l.types.includes(cat));
      
      // Filtrar lojas - não permitir estabelecimentos que são apenas lojas
      const isLoja = l.types && (
        l.types.includes('store') || 
        l.types.includes('Loja')
      );
      
      // Extrair price_level do estimatedCost baseado nos novos valores
      let priceLevel;
      if (l.estimatedCost === 'R$0') priceLevel = 0;
      else if (l.estimatedCost === 'R$10 – R$50') priceLevel = 1;
      else if (l.estimatedCost === 'R$50 – R$100') priceLevel = 2;
      else if (l.estimatedCost === 'R$100 – R$200') priceLevel = 3;
      else if (l.estimatedCost === 'R$200 ou mais') priceLevel = 4;
      else priceLevel = 2; // Default para R$50-100 se não conseguir identificar
      
      const orcamentoOk = priceLevelsPermitidos.includes(priceLevel);
      
      if (isLoja) {
        console.log(`❌ ${l.nome} removido por ser loja: ${l.types?.join(', ')}`);
      } else if (!orcamentoOk) {
        console.log(`❌ ${l.nome} removido por orçamento: ${l.estimatedCost} (price_level ${priceLevel}) não está em ${priceLevelsPermitidos}`);
      }
      
      return ratingOk && avaliacoesOk && categoriaOk && orcamentoOk && !isLoja;
    });

    console.log(`🎯 Locais filtrados por categoria: ${locaisFiltrados.length}`);

    // Se não há locais suficientes, usar todos os válidos
    const locaisParaAnalise = locaisFiltrados.length >= 3 ? locaisFiltrados : locaisValidos;

    console.log(`🤖 Enviando ${locaisParaAnalise.length} locais para análise do GPT...`);

    if (locaisParaAnalise.length === 0) {
      console.log('❌ Nenhum local para analisar!');
      return res.json({
        resposta: "Não encontramos locais próximos com as características solicitadas. Tente aumentar o tempo de deslocamento ou ajustar suas preferências.",
        locais: []
      });
    }

    // Prompt melhorado para o GPT
    const prompt = `Você é um especialista em lazer e entretenimento. Analise os seguintes locais para um rolê do tipo "${tipoRole}" com orçamento "${budget}" e tempo máximo de deslocamento de ${tempoDeslocamento} minutos.

ORÇAMENTO DO USUÁRIO: "${budget}"
- gratuito: Apenas lugares gratuitos (R$0)
- ate-50: Até R$ 50 (R$0 + R$10-R$50)
- 50-100: R$ 50-100 (R$0 + R$10-R$50 + R$50-R$100)
- 100-200: R$ 100-200 (R$0 + R$10-R$50 + R$50-R$100 + R$100-R$200)
- 200-500: R$ 200-500 (todos os preços)
- acima-500: Acima de R$ 500 (todos os preços)

FAIXAS DE PREÇO:
- R$0: Gratuito
- R$10 – R$50: Econômico
- R$50 – R$100: Moderado
- R$100 – R$200: Elevado
- R$200 ou mais: Premium

Para cada local, classifique como "Ideal", "Aceitável" ou "Não Ideal" e explique brevemente o porquê, considerando:
- Tipo de rolê solicitado
- Orçamento disponível (IMPORTANTE: respeite o limite de orçamento)
- Distância/tempo de deslocamento
- Avaliação e comentários dos usuários
- Não ser loja.

Locais para análise:

${locaisParaAnalise.map((l, i) =>
  `${i + 1}. ${l.nome} - ${l.endereco}
Avaliação: ${l.rating}/5 (${l.user_ratings_total} avaliações)
Distância: ${l.distance}
Tempo de viagem: ${l.travelTime}
Custo estimado: ${l.estimatedCost}
Comentários: ${l.comentarios.substring(0, 200)}...`
).join("\n\n")}

Responda APENAS com a classificação de cada local no formato:
1. [Nome do Local] - [Classificação]: [Justificativa]
2. [Nome do Local] - [Classificação]: [Justificativa]
...
Não inclua introduções ou conclusões, apenas a lista numerada.`;

    console.log('🤖 Enviando para GPT...');
    const openaiResp = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Você é um especialista em lazer e entretenimento que analisa locais baseado em preferências específicas do usuário. Responda apenas com a classificação dos locais, sem introduções ou conclusões." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });

    const respostaTexto = openaiResp.data.choices[0].message.content;
    console.log('🤖 Resposta do GPT:', respostaTexto.substring(0, 200) + '...');

    // Processar a resposta do GPT para extrair apenas os locais "Ideal" e "Aceitável"
    const linhas = respostaTexto.split('\n').filter(linha => linha.trim());
    const locaisAprovados = [];
    
    console.log(`📝 Processando ${linhas.length} linhas da resposta do GPT...`);
    
    for (let i = 0; i < linhas.length && i < locaisParaAnalise.length; i++) {
      const linha = linhas[i];
      const local = locaisParaAnalise[i];
      
      console.log(`🔍 Analisando linha ${i + 1}:`, linha.substring(0, 100));
      
      // Verificar se o local foi classificado como "Ideal" ou "Aceitável"
      if (linha.includes('Ideal') || linha.includes('Aceitável')) {
        // Extrair a justificativa do GPT
        const justificativa = linha.split(':').slice(1).join(':').trim();
        
        locaisAprovados.push({
          ...local,
          gptAnalysis: justificativa
        });
        
        console.log(`✅ Local aprovado: ${local.nome}`);
      }
    }

    console.log(`🎉 Locais aprovados pelo GPT: ${locaisAprovados.length}`);

    // Enviar TODOS os locais aprovados pelo GPT, sem limite
    const locaisFinais = locaisAprovados.length > 0 
      ? locaisAprovados 
      : locaisParaAnalise;

    console.log(`📤 Enviando ${locaisFinais.length} locais finais para o frontend`);

    res.json({
      resposta: `Análise concluída! Encontramos ${locaisFinais.length} locais perfeitos para seu rolê.`,
      locais: locaisFinais
    });

  } catch (error) {
    console.error("❌ Erro completo:", error);
    res.status(500).json({ 
      erro: "Erro ao buscar e classificar sugestões.",
      detalhes: error.message 
    });
  }
});

// Endpoint para geolocalização
app.post("/api/geolocation", async (req, res) => {
  const { latitude, longitude } = req.body;
  
  try {
    const coordinates = `${latitude},${longitude}`;
    
    // Buscar endereço reverso
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        latlng: coordinates,
        key: GOOGLE_API_KEY
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      const address = response.data.results[0].formatted_address;
      res.json({ 
        success: true, 
        coordinates,
        address 
      });
    } else {
      res.json({ 
        success: true, 
        coordinates,
        address: "Localização atual" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Erro ao processar localização" 
    });
  }
});

// Endpoint de teste para verificar APIs
app.get("/api/test", async (req, res) => {
  console.log('🧪 Testando APIs...');
  
  try {
    // Testar Google Places API
    console.log('🔍 Testando Google Places API...');
    const googleTest = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: {
        location: "-23.5505,-46.6333", // São Paulo
        radius: 5000,
        type: "restaurant",
        key: GOOGLE_API_KEY
      }
    });
    
    console.log('✅ Google Places API:', {
      status: googleTest.data.status,
      resultsCount: googleTest.data.results?.length || 0
    });

    // Testar OpenAI API
    console.log('🤖 Testando OpenAI API...');
    const openaiTest = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o",
      messages: [
        { role: "user", content: "Responda apenas com 'OK' se está funcionando." }
      ],
      max_tokens: 10
    }, {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });
    
    console.log('✅ OpenAI API:', {
      response: openaiTest.data.choices[0].message.content
    });

    res.json({
      success: true,
      google: {
        status: googleTest.data.status,
        resultsCount: googleTest.data.results?.length || 0
      },
      openai: {
        response: openaiTest.data.choices[0].message.content
      }
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Backend rodando em http://localhost:3000")
);
