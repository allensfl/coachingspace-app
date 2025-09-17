import React from 'react';
import { Bot, KeyRound, Save, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const AiAssistantPanel = ({ aiSettings, onUpdateAiSetting, toast }) => {
    return (
        <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Bot /> KI-Assistent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">KI-Modell</Label>
                  <Select value={aiSettings.selectedModel || 'local'} onValueChange={(value) => onUpdateAiSetting('selectedModel', value)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Integrierter Coach-Bot (Lokal)</SelectItem>
                      <SelectItem value="openai-gpt4">OpenAI: GPT-4</SelectItem>
                      <SelectItem value="anthropic-claude">Anthropic: Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {aiSettings.selectedModel && aiSettings.selectedModel !== 'local' && (
                  <div>
                    <Label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><KeyRound className="h-4 w-4" /> API-Schlüssel für {aiSettings.selectedModel}</Label>
                    <div className="flex gap-2">
                      <Input type="password" placeholder="sk-..." value={aiSettings.apiKey || ''} onChange={e => onUpdateAiSetting('apiKey', e.target.value)} />
                      <Button size="icon" onClick={() => toast({title: "API-Schlüssel lokal gespeichert!"})}><Save className="h-4 w-4" /></Button>
                    </div>
                     <a href="https://platform.openai.com/playground" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1">
                      Zum OpenAI Playground <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
            </CardContent>
        </Card>
    );
};