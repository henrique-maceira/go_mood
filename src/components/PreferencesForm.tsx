
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { UserPreferences, ActivityType, ActivityTypes } from '@/types';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onSubmit, isLoading }) => {
  const [budget, setBudget] = useState<string>('');
  const [maxTravelTime, setMaxTravelTime] = useState<number[]>([30]);
  const [activityType, setActivityType] = useState<ActivityType | ''>('');
  const [location, setLocation] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !activityType) return;

    onSubmit({
      budget,
      maxTravelTime: maxTravelTime[0],
      activityType: activityType as ActivityType,
      location: location || undefined,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Encontre seu Rolê Perfeito! 🎯</CardTitle>
        <p className="text-purple-100">Diga suas preferências e vamos sugerir os melhores lugares</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Localização */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              Sua localização (opcional)
            </Label>
            <Input
              id="location"
              placeholder="Ex: Vila Madalena, SP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-gray-200 focus:border-purple-500"
            />
          </div>

          {/* Orçamento */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              Orçamento disponível
            </Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="border-gray-200 focus:border-purple-500">
                <SelectValue placeholder="Selecione seu orçamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gratuito">Gratuito</SelectItem>
                <SelectItem value="ate-50">Até R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                <SelectItem value="200-500">R$ 200 - R$ 500</SelectItem>
                <SelectItem value="acima-500">Acima de R$ 500</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tempo de deslocamento */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Tempo máximo de deslocamento: <span className="font-bold text-purple-600">{maxTravelTime[0]} min</span>
            </Label>
            <Slider
              value={maxTravelTime}
              onValueChange={setMaxTravelTime}
              max={120}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Tipo de rolê */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de rolê</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(ActivityTypes).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivityType(key as ActivityType)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    activityType === key
                      ? `${value.color} text-white border-transparent shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{value.emoji}</div>
                  <div className="text-xs font-medium">{value.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105"
            disabled={!budget || !activityType || isLoading}
          >
            {isLoading ? 'Buscando sugestões...' : 'Encontrar Sugestões! 🚀'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
