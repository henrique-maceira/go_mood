
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suggestion } from '@/types';
import { MapPin, Clock, DollarSign, Star, ExternalLink } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {suggestion.image && (
        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400 relative overflow-hidden">
          <img
            src={suggestion.image}
            alt={suggestion.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {suggestion.category}
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">
              {suggestion.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium text-gray-600">{suggestion.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {suggestion.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{suggestion.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-green-500" />
            <span>{suggestion.travelTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <DollarSign className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{suggestion.estimatedCost}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-purple-600">Por que recomendamos:</span>
            <br />
            {suggestion.reason}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestion.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {suggestion.link && (
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-purple-500 group-hover:text-white transition-colors"
            onClick={() => window.open(suggestion.link, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Mais informações
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
