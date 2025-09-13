
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Zap, Users, Clock, Star, List, GitBranch, SlidersHorizontal, CheckSquare, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap = {
  Target, Compass, Zap, Users, Clock, Star, List, GitBranch, SlidersHorizontal, CheckSquare, FileText, Upload
};

const ToolCard = ({ tool, onCardClick, onToggleFavorite }) => {
  const IconComponent = iconMap[tool.icon] || Target;
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
      <Card className="glass-card hover:bg-slate-800/50 transition-all duration-300 group h-full flex flex-col relative">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 z-10"
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool.id); }}
                    >
                        <Star className={`h-5 w-5 transition-colors ${tool.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tool.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="h-6 w-6 text-white" />
            </div>
             <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className={tool.status === 'active' ? 'bg-green-600/20 text-green-400 border-green-500/30' : ''}>
              {tool.status === 'active' ? 'Aktiv' : 'Archiviert'}
            </Badge>
          </div>
          <CardTitle className="text-white group-hover:text-blue-400 transition-colors pr-10">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-2">{tool.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs w-fit">{tool.category}</Badge>
            {tool.type === 'file' && <Badge variant="secondary" className="text-xs w-fit">Datei</Badge>}
            {tool.isCustom && <Badge variant="secondary" className="text-xs w-fit bg-purple-600/20 text-purple-400 border-purple-500/30">Eigenes</Badge>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ToolCard;
