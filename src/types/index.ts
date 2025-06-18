
export interface UserPreferences {
  budget: string;
  maxTravelTime: number;
  activityType: ActivityType;
  location?: string;
}

export type ActivityType = 
  | 'familia' 
  | 'casal' 
  | 'fitness' 
  | 'amigos' 
  | 'cultura' 
  | 'aventura' 
  | 'relaxamento';

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  distance: string;
  travelTime: string;
  estimatedCost: string;
  rating: number;
  description: string;
  reason: string;
  link?: string;
  image?: string;
  tags: string[];
}

export const ActivityTypes: Record<ActivityType, { label: string; emoji: string; color: string }> = {
  familia: { label: 'Família', emoji: '👨‍👩‍👧‍👦', color: 'bg-blue-500' },
  casal: { label: 'Casal (Date)', emoji: '💕', color: 'bg-pink-500' },
  fitness: { label: 'Fitness', emoji: '💪', color: 'bg-green-500' },
  amigos: { label: 'Com Amigos', emoji: '🎉', color: 'bg-purple-500' },
  cultura: { label: 'Cultura', emoji: '🎭', color: 'bg-indigo-500' },
  aventura: { label: 'Aventura', emoji: '🏔️', color: 'bg-orange-500' },
  relaxamento: { label: 'Relaxamento', emoji: '🧘‍♀️', color: 'bg-teal-500' },
};
