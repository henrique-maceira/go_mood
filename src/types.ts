// src/types.ts

export type ActivityType =
  | 'familia' 
  | 'casal' 
  | 'fitness' 
  | 'amigos' 
  | 'cultura' 
  | 'aventura' 
  | 'relaxamento';

export interface ActivityTypeDetails {
  label: string;
  emoji: string;
  color: string;
  categories: string[];
  description: string;
}

export const ActivityTypes: Record<ActivityType, ActivityTypeDetails> = {
  familia: { 
    label: 'Família', 
    emoji: '👨‍👩‍👧‍👦', 
    color: 'bg-blue-500',
    categories: ['Parques', 'Museus', 'Aquários', 'Zoológicos', 'Parques de diversão', 'Restaurantes', 'Cinemas', 'Bibliotecas'],
    description: 'Locais perfeitos para toda a família'
  },
  casal: { 
    label: 'Casal (Date)', 
    emoji: '💕', 
    color: 'bg-pink-500',
    categories: ['Restaurantes', 'Cinemas', 'Galerias de arte', 'Parques', 'Bares', 'Spas', 'Salões de beleza', 'Pontos turísticos'],
    description: 'Experiências românticas e especiais'
  },
  fitness: { 
    label: 'Fitness', 
    emoji: '💪', 
    color: 'bg-green-500',
    categories: ['Parques', 'Academias', 'Lojas de bicicletas', 'Complexos esportivos', 'Estádios', 'Centros de saúde'],
    description: 'Atividades físicas e esportivas'
  },
  amigos: { 
    label: 'Com Amigos', 
    emoji: '🎉', 
    color: 'bg-purple-500',
    categories: ['Bares', 'Casas noturnas', 'Restaurantes', 'Boliches', 'Parques de diversão', 'Cinemas', 'Karaokês', 'Arcades'],
    description: 'Diversão e entretenimento em grupo'
  },
  cultura: { 
    label: 'Cultura', 
    emoji: '🎭', 
    color: 'bg-indigo-500',
    categories: ['Museus', 'Galerias de arte', 'Teatros', 'Bibliotecas', 'Pontos turísticos', 'Igrejas históricas', 'Universidades', 'Centros culturais'],
    description: 'Experiências culturais e educativas'
  },
  aventura: { 
    label: 'Aventura', 
    emoji: '🏔️', 
    color: 'bg-orange-500',
    categories: ['Parques', 'Pontos turísticos', 'Parques de diversão', 'Aquários', 'Zoológicos', 'Campings', 'Atrações naturais', 'Montanhas'],
    description: 'Aventuras e experiências ao ar livre'
  },
  relaxamento: { 
    label: 'Relaxamento', 
    emoji: '🧘‍♀️', 
    color: 'bg-teal-500',
    categories: ['Spas', 'Parques', 'Salões de beleza', 'Restaurantes', 'Bares', 'Bibliotecas', 'Galerias de arte', 'Jardins'],
    description: 'Momentos de paz e tranquilidade'
  },
};

export interface UserPreferences {
  budget: string;
  maxTravelTime: number;
  tipoRole: ActivityType;
  location?: string;
  openNow?: boolean;
}

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  distance: string;
  travelTime: string;
  estimatedCost: string;
  rating: number | null;
  description: string;
  reason: string;
  link?: string;
  image?: string | null;
  tags: string[];
}
