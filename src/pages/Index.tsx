import React, { useState } from 'react';
import { Suggestion, UserPreferences } from '@/types';
import PreferencesForm from '@/components/PreferencesForm';
import SuggestionsList from '@/components/SuggestionsList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { buscarSugestoes } from '@/api';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreferencesSubmit = async (userPreferences: UserPreferences) => {
    setIsLoading(true);
    setPreferences(userPreferences);
    setError(null);

    try {
      // buscarSugestoes agora retorna diretamente Suggestion[]
      const sugestoes: Suggestion[] = await buscarSugestoes(userPreferences);

      setSuggestions(sugestoes);
      setCurrentStep('results');
    } catch (err) {
      console.error('Erro ao buscar sugestões:', err);
      setError('Não foi possível buscar sugestões no momento. Tente novamente.');
    }

    setIsLoading(false);
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setSuggestions([]);
    setPreferences(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  GoMood
                </h1>
                <p className="text-sm text-gray-500">Seu humor decide. A gente mostra o lugar!</p>
              </div>
            </div>
            {currentStep === 'results' && (
              <Button variant="outline" onClick={handleBackToForm} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Nova busca
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentStep === 'form' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                Descubra seu próximo rolê! 🎉
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Conte suas preferências e vamos sugerir os melhores lugares e eventos
                da sua região, personalizados especialmente para você.
              </p>
            </div>

            <PreferencesForm onSubmit={handlePreferencesSubmit} isLoading={isLoading} />

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
          </div>
        )}

        {currentStep === 'results' && (
          <SuggestionsList suggestions={suggestions} preferences={preferences} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">
            ✨ Desenvolvido para ajudar você a descobrir experiências incríveis ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
