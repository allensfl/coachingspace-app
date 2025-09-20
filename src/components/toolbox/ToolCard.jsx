import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Zap, Users, Clock, Star, List, GitBranch, SlidersHorizontal, CheckSquare, FileText, Upload, Scale, Play, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap = {
  Target, Compass, Zap, Users, Clock, Star, List, GitBranch, SlidersHorizontal, CheckSquare, FileText, Upload, Scale, Play, Settings
};

const difficultyColors = {
  'Einfach': 'bg-green-600/20 text-green-400 border-green-500/30',
  'Mittel': 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
  'Fortgeschritten': 'bg-red-600/20 text-red-400 border-red-500/30'
};

const ToolCard = ({ tool, onCardClick, onToggleFavorite }) => {
  const IconComponent = iconMap[tool.icon] || Target;
  const isInteractive = tool.type === 'interactive';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer"
      onClick={() => onCardClick(tool)}
    >
      <Card className={`glass-card hover:bg-slate-800/50 transition-all duration-300 group h-full flex flex-col relative ${
        isInteractive ? 'ring-1 ring-blue-500/30 hover:ring-blue-500/50' : ''
      }`}>
        {/* Favoriten-Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 z-10"
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool.id); }}
              >
                <Star className={`h-5 w-5 transition-colors ${
                  tool.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 hover:text-yellow-400'
                }`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
              isInteractive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              {/* Status Badge */}
              <Badge 
                variant={tool.status === 'active' ? 'default' : 'secondary'} 
                className={tool.status === 'active' ? 'bg-green-600/20 text-green-400 border-green-500/30' : ''}
              >
                {tool.status === 'active' ? 'Aktiv' : 'Archiviert'}
              </Badge>
              
              {/* Interactive Badge */}
              {isInteractive && (
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                  Interaktiv
                </Badge>
              )}
            </div>
          </div>
          
          <CardTitle className="text-white group-hover:text-blue-400 transition-colors pr-10">
            {tool.name}
          </CardTitle>
          
          {/* Duration für interaktive Tools */}
          {isInteractive && tool.estimatedDuration && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{tool.estimatedDuration}</span>
            </div>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 flex flex-col">
          <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
            {tool.description}
          </p>

          {/* Features für interaktive Tools */}
          {isInteractive && tool.features && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 2).map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-slate-700/50 border-slate-600"
                  >
                    {feature}
                  </Badge>
                ))}
                {tool.features.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-slate-700/50 border-slate-600"
                  >
                    +{tool.features.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Bottom Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Kategorie */}
              <Badge variant="outline" className="text-xs w-fit">
                {tool.category}
              </Badge>
              
              {/* Tool-Typ spezifische Badges */}
              {tool.type === 'file' && (
                <Badge variant="secondary" className="text-xs w-fit">
                  Datei
                </Badge>
              )}
              
              {tool.isCustom && (
                <Badge variant="secondary" className="text-xs w-fit bg-purple-600/20 text-purple-400 border-purple-500/30">
                  Eigenes
                </Badge>
              )}
            </div>

            {/* Schwierigkeit für interaktive Tools */}
            {isInteractive && tool.difficulty && (
              <Badge 
                variant="outline" 
                className={`text-xs ${difficultyColors[tool.difficulty] || 'bg-slate-600/20 text-slate-400'}`}
              >
                {tool.difficulty}
              </Badge>
            )}
          </div>

          {/* Interaktives Tool - Zusatz-Info */}
          {isInteractive && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400">
                  <Play className="h-3 w-3" />
                  <span>Sofort verwendbar</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Settings className="h-3 w-3" />
                  <span>Mit Export</span>
                </div>
              </div>
            </div>
          )}

          {/* Usage History Badge */}
          {tool.usageHistory && tool.usageHistory.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <div className="text-xs text-slate-400">
                {tool.usageHistory.length}x verwendet
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ToolCard;