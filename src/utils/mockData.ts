
import { Suggestion, ActivityType } from '@/types';

export const generateMockSuggestions = (preferences: any): Suggestion[] => {
  const suggestions: Record<ActivityType, Suggestion[]> = {
    familia: [
      {
        id: '1',
        name: 'Parque da Juventude',
        category: 'Parque',
        distance: '2.3 km',
        travelTime: '12 min',
        estimatedCost: 'Gratuito',
        rating: 4.6,
        description: 'Parque amplo com playground, quadras esportivas e área de piquenique. Perfeito para toda família se divertir.',
        reason: 'Espaço seguro e gratuito, ideal para crianças brincarem enquanto os adultos relaxam.',
        image: '/placeholder.svg',
        tags: ['Gratuito', 'Playground', 'Seguro', 'Estacionamento'],
        link: 'https://maps.google.com'
      },
      {
        id: '2',
        name: 'Aquário de São Paulo',
        category: 'Atração',
        distance: '5.1 km',
        travelTime: '18 min',
        estimatedCost: 'R$ 45 por pessoa',
        rating: 4.4,
        description: 'Experiência educativa incrível com mais de 3.000 animais marinhos e terrestres.',
        reason: 'Combina diversão e aprendizado, mantendo crianças e adultos envolvidos.',
        image: '/placeholder.svg',
        tags: ['Educativo', 'Indoor', 'Animais', 'Ar condicionado'],
        link: 'https://maps.google.com'
      }
    ],
    casal: [
      {
        id: '3',
        name: 'Rooftop Skye Bar',
        category: 'Bar',
        distance: '1.8 km',
        travelTime: '8 min',
        estimatedCost: 'R$ 120 por casal',
        rating: 4.8,
        description: 'Bar no terraço com vista panorâmica da cidade e coquetéis autorais.',
        reason: 'Ambiente romântico com vista deslumbrante, perfeito para um encontro especial.',
        image: '/placeholder.svg',
        tags: ['Vista panorâmica', 'Romântico', 'Coquetéis', 'Pôr do sol'],
        link: 'https://maps.google.com'
      },
      {
        id: '4',
        name: 'Pinacoteca do Estado',
        category: 'Museu',
        distance: '3.2 km',
        travelTime: '15 min',
        estimatedCost: 'R$ 12 por pessoa',
        rating: 4.7,
        description: 'Importante museu de arte brasileira com exposições permanentes e temporárias.',
        reason: 'Programa cultural sofisticado, ideal para casais que apreciam arte e conversas profundas.',
        image: '/placeholder.svg',
        tags: ['Arte', 'Cultura', 'Histórico', 'Climatizado'],
        link: 'https://maps.google.com'
      }
    ],
    fitness: [
      {
        id: '5',
        name: 'Aula de Yoga no Ibirapuera',
        category: 'Atividade',
        distance: '4.5 km',
        travelTime: '22 min',
        estimatedCost: 'Gratuito',
        rating: 4.5,
        description: 'Aulas gratuitas de yoga ao ar livre todos os sábados às 9h.',
        reason: 'Atividade física gratuita em contato com a natureza, perfeita para começar o dia.',
        image: '/placeholder.svg',
        tags: ['Gratuito', 'Ao ar livre', 'Yoga', 'Sábados'],
        link: 'https://maps.google.com'
      }
    ],
    amigos: [
      {
        id: '6',
        name: 'Vila Madalena Pub Crawl',
        category: 'Entretenimento',
        distance: '3.1 km',
        travelTime: '16 min',
        estimatedCost: 'R$ 80 por pessoa',
        rating: 4.6,
        description: 'Tour pelos melhores bares da Vila Madalena com drinks inclusos.',
        reason: 'Experiência divertida em grupo, conhecendo os melhores points da região.',
        image: '/placeholder.svg',
        tags: ['Drinks inclusos', 'Socialização', 'Música', 'Noturno'],
        link: 'https://maps.google.com'
      }
    ],
    cultura: [
      {
        id: '7',
        name: 'Teatro Municipal',
        category: 'Teatro',
        distance: '2.7 km',
        travelTime: '14 min',
        estimatedCost: 'R$ 60 por pessoa',
        rating: 4.9,
        description: 'Espetáculo de ballet clássico no icônico Teatro Municipal.',
        reason: 'Experiência cultural única em um dos teatros mais importantes do país.',
        image: '/placeholder.svg',
        tags: ['Ballet', 'Histórico', 'Clássico', 'Elegante'],
        link: 'https://maps.google.com'
      }
    ],
    aventura: [
      {
        id: '8',
        name: 'Escalada no Pico do Jaraguá',
        category: 'Esporte',
        distance: '25 km',
        travelTime: '45 min',
        estimatedCost: 'R$ 30 equipamentos',
        rating: 4.3,
        description: 'Trilha e escalada no ponto mais alto da cidade de São Paulo.',
        reason: 'Desafio físico emocionante com recompensa de vista incrível da cidade.',
        image: '/placeholder.svg',
        tags: ['Trilha', 'Vista panorâmica', 'Desafio', 'Natureza'],
        link: 'https://maps.google.com'
      }
    ],
    relaxamento: [
      {
        id: '9',
        name: 'Spa Urbano Zen',
        category: 'Spa',
        distance: '1.2 km',
        travelTime: '6 min',
        estimatedCost: 'R$ 180 por pessoa',
        rating: 4.7,
        description: 'Day spa com massagens relaxantes e tratamentos faciais.',
        reason: 'Ambiente tranquilo para desestressar e renovar as energias.',
        image: '/placeholder.svg',
        tags: ['Massagem', 'Relaxante', 'Tranquilo', 'Profissional'],
        link: 'https://maps.google.com'
      }
    ]
  };

  const activitySuggestions = suggestions[preferences.activityType] || [];
  
  // Filter by budget (simplified logic)
  return activitySuggestions.filter(suggestion => {
    if (preferences.budget === 'gratuito') {
      return suggestion.estimatedCost.toLowerCase().includes('gratuito');
    }
    return true; // For demo purposes, return all non-free options for paid budgets
  });
};
