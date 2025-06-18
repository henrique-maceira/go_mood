
import React from 'react';
import { Suggestion } from '@/types';
import SuggestionCard from './SuggestionCard';
import { Sparkles } from 'lucide-react';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  preferences: any;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, preferences }) => {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Nenhuma sugestão encontrada
        </h3>
        <p className="text-gray-500">
          Tente ajustar suas preferências para encontrar mais opções
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Suas Sugestões Personalizadas
        </h2>
        <p className="text-gray-600">
          Encontramos {suggestions.length} opções perfeitas para seu rolê!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsList;
