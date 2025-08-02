import { UserPreferences, Suggestion } from './types';

interface LocationData {
  coordinates: string;
  address: string;
}

interface GeolocationResponse {
  success: boolean;
  coordinates?: string;
  address?: string;
  error?: string;
}

interface BackendResponse {
  resposta: string;
  locais: Array<{
    nome: string;
    endereco: string;
    rating: number;
    comentarios: string;
    link: string;
    imagem: string | null;
    distance: string;
    travelTime: string;
    estimatedCost: string;
    types: string[];
    openingHours: string[];
    gptAnalysis?: string;
  }>;
}

// Função para obter localização do usuário
export async function getUserLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não é suportada pelo navegador"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Enviar coordenadas para o backend para obter endereço
          const response = await fetch("http://localhost:3000/api/geolocation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data: GeolocationResponse = await response.json();
          
          if (data.success) {
            resolve({
              coordinates: data.coordinates || `${latitude},${longitude}`,
              address: data.address || "Localização atual"
            });
          } else {
            resolve({
              coordinates: `${latitude},${longitude}`,
              address: "Localização atual"
            });
          }
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error("Erro ao obter localização: " + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  });
}

export async function buscarSugestoes(preferences: UserPreferences): Promise<Suggestion[]> {
  const response = await fetch("http://localhost:3000/api/sugestoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      localizacao: preferences.location,
      tipoRole: preferences.tipoRole,
      tempoDeslocamento: preferences.maxTravelTime,
      budget: preferences.budget,
      openNow: preferences.openNow,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  const data: BackendResponse = await response.json();
  const { locais } = data;

  console.log('API Debug - Locais recebidos do backend:', {
    totalLocais: locais?.length,
    locaisNomes: locais?.map(l => l.nome)
  });

  // Mapear locais filtrados pelo GPT
  const formattedSuggestions: Suggestion[] = locais.map((local, index) => ({
    id: `sugestao-${index + 1}`,
    name: local.nome,
    category: local.types?.[0] || 'Entretenimento',
    distance: local.distance || 'N/A',
    travelTime: local.travelTime || 'N/A',
    estimatedCost: local.estimatedCost || '$$',
    rating: local.rating || null,
    description: local.endereco,
    reason: local.gptAnalysis || "Aprovado pelo nosso especialista!",
    link: local.link || '',
    image: local.imagem || null,
    tags: local.types?.slice(0, 3) || ['Entretenimento']
  }));

  console.log('API Debug - Sugestões formatadas:', {
    totalSugestoes: formattedSuggestions.length,
    sugestoesNomes: formattedSuggestions.map(s => s.name)
  });

  // Retornar apenas os locais reais
  return formattedSuggestions;
} 