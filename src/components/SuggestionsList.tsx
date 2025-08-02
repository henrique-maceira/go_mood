// src/components/SuggestionsList.tsx

import React, { useState } from 'react';
import { Suggestion, UserPreferences } from '@/types';
import SuggestionCard from './SuggestionCard';
import { Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  preferences: UserPreferences | null;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, preferences }) => {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 15;
  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, initialCount);
  
  // Debug logs
  console.log('SuggestionsList Debug:', {
    totalSuggestions: suggestions?.length,
    showAll,
    initialCount,
    displayedCount: displayedSuggestions?.length,
    shouldShowButton: suggestions && suggestions.length > initialCount,
    hasMoreSuggestions: suggestions && suggestions.length > initialCount,
    suggestionsArray: suggestions?.map(s => s.name)
  });

  if (!suggestions || suggestions.length === 0) {
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

  const hasMoreSuggestions = suggestions.length > initialCount;
  
  console.log('Render Debug:', {
    hasMoreSuggestions,
    suggestionsLength: suggestions.length,
    initialCount,
    showAll,
    willShowButton: !showAll && hasMoreSuggestions
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Suas Sugestões Personalizadas
        </h2>
        <p className="text-gray-600">
          Encontramos {suggestions.length} opções perfeitas para seu rolê!
          {!showAll && hasMoreSuggestions && (
            <span className="block text-sm text-gray-500 mt-1">
              Mostrando {initialCount} de {suggestions.length} sugestões aprovadas pelo GPT
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSuggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>

      {!showAll && hasMoreSuggestions && (
        <div className="text-center pt-6">
          <Button
            onClick={() => setShowAll(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Ver Todas as {suggestions.length} Sugestões ({suggestions.length - initialCount} restantes)
          </Button>
        </div>
      )}

      {showAll && hasMoreSuggestions && (
        <div className="text-center pt-6">
          <p className="text-gray-500 text-sm">
            Mostrando todas as {suggestions.length} sugestões aprovadas pelo GPT
          </p>
        </div>
      )}
    </div>
  );
};

export default SuggestionsList;
