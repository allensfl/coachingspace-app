import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseConfig';
import { Sparkles, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function WeeklyImpulsesCard({ coachee }) {
  const { toast } = useToast();
  const [impulses, setImpulses] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    week_number: getCurrentWeek(),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadImpulses();
  }, [coachee.id]);

  function getCurrentWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  }

  const loadImpulses = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data, error } = await supabase
        .from('weekly_impulses')
        .select('*')
        .eq('coach_id', userData.user.id)
        .eq('coachee_id', coachee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImpulses(data || []);
    } catch (error) {
      console.error('Error loading impulses:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte Titel und Inhalt eingeben.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('weekly_impulses')
          .update({
            title: formData.title,
            content: formData.content,
            week_number: formData.week_number,
            year: formData.year,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Impuls aktualisiert",
          className: "bg-green-600 text-white"
        });
      } else {
        // Create
        const { error } = await supabase
          .from('weekly_impulses')
          .insert([{
            coach_id: userData.user.id,
            coachee_id: coachee.id,
            title: formData.title,
            content: formData.content,
            week_number: formData.week_number,
            year: formData.year
          }]);

        if (error) throw error;

        toast({
          title: "Wochenimpuls erstellt",
          description: `${coachee.firstName} kann den Impuls jetzt im Portal sehen.`,
          className: "bg-green-600 text-white"
        });
      }

      resetForm();
      loadImpulses();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Fehler",
        description: "Impuls konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (impulse) => {
    setEditingId(impulse.id);
    setFormData({
      title: impulse.title,
      content: impulse.content,
      week_number: impulse.week_number,
      year: impulse.year
    });
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('weekly_impulses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadImpulses();
      toast({
        title: "Impuls gelöscht",
        className: "bg-blue-600 text-white"
      });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      week_number: getCurrentWeek(),
      year: new Date().getFullYear()
    });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Wochenimpulse
          </CardTitle>
          {!isCreating && (
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Neuer Impuls
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="KW"
                value={formData.week_number}
                onChange={(e) => setFormData({...formData, week_number: parseInt(e.target.value)})}
                className="w-20 bg-slate-600/50 border-slate-500 text-white"
              />
              <Input
                type="number"
                placeholder="Jahr"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="w-24 bg-slate-600/50 border-slate-500 text-white"
              />
            </div>
            <Input
              placeholder="Titel des Impulses"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-slate-600/50 border-slate-500 text-white"
            />
            <Textarea
              placeholder="Inhalt des Impulses..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="bg-slate-600/50 border-slate-500 text-white"
              rows={6}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Aktualisieren' : 'Erstellen'}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="h-4 w-4 mr-2" />
                Abbrechen
              </Button>
            </div>
          </div>
        )}

        {/* Impulses List */}
        {impulses.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <p>Noch keine Wochenimpulse erstellt.</p>
            <p className="text-sm mt-2">Erstelle inspirierende wöchentliche Impulse für {coachee.firstName}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {impulses.map(impulse => (
              <div key={impulse.id} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{impulse.title}</h4>
                    <Badge className="mt-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      KW {impulse.week_number}, {impulse.year}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(impulse)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(impulse.id)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mt-3 whitespace-pre-wrap">
                  {impulse.content}
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  Erstellt am {new Date(impulse.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}