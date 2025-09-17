
import React from 'react';
import { motion } from 'framer-motion';
import { User, Users2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const mockImages = [
  { id: 1, alt: 'Weg durch einen Wald zum Licht', keywords: ['Hoffnung', 'Weg', 'Zukunft', 'Natur'] },
  { id: 2, alt: 'Bergsteiger auf einem Gipfel', keywords: ['Erfolg', 'Herausforderung', 'Ziel', 'Stärke'] },
  { id: 3, alt: 'Kompass in einer Hand', keywords: ['Orientierung', 'Entscheidung', 'Richtung'] },
  { id: 4, alt: 'Stürmische See', keywords: ['Chaos', 'Unsicherheit', 'Krise', 'Emotionen'] },
  { id: 5, alt: 'Wachsende Pflanze', keywords: ['Entwicklung', 'Wachstum', 'Potenzial', 'Leben'] },
  { id: 6, alt: 'Labyrinth von oben', keywords: ['Komplexität', 'Verwirrung', 'Suche', 'Problem'] },
];

const avatarsByStep = {
    6: [
        { name: 'Teamchefin', color: '#4f46e5', key: 'authority' },
        { name: 'Unterstützer', color: '#10b981', key: 'supporter' },
        { name: 'Bremse', color: '#ef4444', key: 'blocker' },
    ],
    9: [
        { name: 'Perfektionismus', color: '#f97316', key: 'blocker' },
        { name: 'Anerkennungsstreben', color: '#ec4899', key: 'blocker' },
        { name: 'Zurückhaltung', color: '#8b5cf6', key: 'blocker' },
    ]
};

export const getAvatarsForStep = (step) => avatarsByStep[step] || [];

const AvatarSetup = ({ avatars, userInput, onUserInput, toolName, toolLink }) => {
  return (
    <div>
      <Card className="bg-slate-800/50 border-slate-700 mb-4">
        <div className="flex items-center justify-between pr-4">
          <CardHeader>
            <CardTitle className="text-base text-amber-400 flex items-center">
              <Users2 className="mr-2" /> Virtuelle Aufstellung
            </CardTitle>
          </CardHeader>
          {toolLink && toolName && (
             <Button variant="outline" size="sm" asChild>
                <a href={toolLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-400 hover:text-white"> {/* Changed text color */}
                  <ExternalLink className="mr-2 h-4 w-4" /> {toolName} öffnen
                </a>
              </Button>
          )}
        </div>
        <CardContent className="flex justify-around items-center h-24 pt-0">
          {avatars.map(avatar => (
            <div key={avatar.name} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: avatar.color }}>
                <User className="text-white" />
              </div>
              <p className="text-xs text-slate-300">{avatar.name}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Textarea
        value={userInput}
        onChange={e => onUserInput(e.target.value)}
        placeholder={`Transkript des tiefenpsychologischen Interviews mit den Anteilen (insb. ${avatars.find(a=>a.key === 'blocker')?.name || 'der Bremse'}) protokollieren...`}
        className="min-h-[150px] bg-slate-800/50 border-slate-700 text-base text-slate-300" /* Changed text color */
      />
    </div>
  );
};


export const renderStepContent = (currentStep, userInput, onUserInput, selectedImage, onSetSelectedImage) => {
    switch (currentStep) {
      case 1: case 2: case 4: case 5: case 7: case 8: case 10: case 11: case 12:
        return(
            <Textarea
              value={userInput}
              onChange={e => onUserInput(e.target.value)}
              placeholder="Coach protokolliert hier die Eingaben oder Ergebnisse des Gesprächs..."
              className="min-h-[150px] bg-slate-800/50 border-slate-700 text-base text-slate-300" /* Changed text color */
            />
        );
      case 3:
        return (
          <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-300">Coachee wählt ein Bild zur Zielvisualisierung.</p>
                <Button variant="outline" size="sm" asChild>
                    <a href="https://unsplash.com/s/photos/emotion" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-400 hover:text-white"> {/* Changed text color */}
                        <ImageIcon className="mr-2 h-4 w-4"/> Externes Bildarchiv öffnen
                    </a>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {mockImages.map(img => (
                    <motion.div key={img.id} whileHover={{scale: 1.05}} className={`rounded-lg overflow-hidden cursor-pointer border-4 ${selectedImage?.id === img.id ? 'border-primary' : 'border-transparent'}`} onClick={() => onSetSelectedImage(img)}>
                       <img  alt={img.alt} src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                    </motion.div>
                  ))}
              </div>
              <Textarea
                value={userInput}
                onChange={e => onUserInput(e.target.value)}
                placeholder="Coach protokolliert hier die Beschreibung des Coachees zum Bild..."
                className="min-h-[100px] bg-slate-800/50 border-slate-700 text-base text-slate-300" /* Changed text color */
                disabled={!selectedImage}
            />
          </div>
        );
      case 6: case 9:
        const avatars = getAvatarsForStep(currentStep);
        return (
            <AvatarSetup
                avatars={avatars}
                userInput={userInput}
                onUserInput={onUserInput}
                toolName="CoSpaces"
                toolLink="https://cospaces.io/"
            />
        );
      default:
        return null;
    }
  }
