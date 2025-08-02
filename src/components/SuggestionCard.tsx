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
  const {
    image,
    category,
    name,
    rating,
    description,
    distance,
    travelTime,
    estimatedCost,
    reason,
    tags,
    link,
  } = suggestion;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {image && (
        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400 relative overflow-hidden">
          <img
            src={image}
            alt={name || 'Imagem do local'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {category && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {category}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">
              {name || 'Sugestão'}
            </h3>
            {rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium text-gray-600">{rating}</span>
              </div>
            )}
          </div>

          {(description || reason) && (
            <div className="space-y-2">
              {description && (
                <div className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{description}</span>
                </div>
              )}
              {reason && !description && (
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {reason}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {distance && distance !== 'N/A' && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{distance}</span>
            </div>
          )}
          {travelTime && travelTime !== 'N/A' && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-green-500" />
              <span>{travelTime}</span>
            </div>
          )}
          {estimatedCost && estimatedCost !== 'Preço não informado' && (
            <div className="flex items-center gap-2 text-gray-600 col-span-2">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                estimatedCost === 'R$0' ? 'bg-green-100 text-green-700' :
                estimatedCost === 'R$10 – R$50' ? 'bg-blue-100 text-blue-700' :
                estimatedCost === 'R$50 – R$100' ? 'bg-yellow-100 text-yellow-700' :
                estimatedCost === 'R$100 – R$200' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {estimatedCost}
              </span>
            </div>
          )}
        </div>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {link && (
          <Button
            variant="outline"
            className="w-full group-hover:bg-purple-500 group-hover:text-white transition-colors"
            onClick={() => window.open(link, '_blank')}
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
