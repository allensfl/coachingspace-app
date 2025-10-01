import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Loader2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppStateContext } from '@/context/AppStateContext';

const ConsentPage = () => {
  const { coacheeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { settings } = state;
  const { getCoacheeById, updateCoacheeConsent } = actions;
  
  const [coachee, setCoachee] = useState(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const privacyPolicyRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (state.isLoading) return;
    const foundCoachee = getCoacheeById(coacheeId);
    if (foundCoachee) {
      setCoachee(foundCoachee);
      setHasConsented(foundCoachee.consents.gdpr);
    }
    setIsLoading(false);
  }, [coacheeId, getCoacheeById, state.isLoading, state.coachees]);

  const generatePdfBlob = async () => {
    const input = privacyPolicyRef.current;
    if (!input) return null;

    const originalColor = input.style.color;
    input.style.color = 'black';
    const elementsToHide = input.querySelectorAll('.hide-on-pdf');
    elementsToHide.forEach(el => el.style.display = 'none');

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      input.style.color = originalColor;
      elementsToHide.forEach(el => el.style.display = '');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      let imgHeight = pdfWidth / ratio;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      return pdf.output('blob');
    } catch (err) {
      console.error("PDF generation failed:", err);
      input.style.color = originalColor;
      elementsToHide.forEach(el => el.style.display = '');
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    setIsProcessing(true);
    toast({ title: 'PDF wird generiert...', description: 'Bitte warten Sie einen Moment.' });
    
    const blob = await generatePdfBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datenschutzerklaerung-${coachee.lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: '✅ Download erfolgreich!', description: 'Die PDF-Datei wurde heruntergeladen.' });
    } else {
      toast({ variant: 'destructive', title: 'Fehler beim Download', description: 'Die PDF konnte nicht erstellt werden.' });
    }
    setIsProcessing(false);
  };

  const handleConsent = async () => {
    setIsProcessing(true);
    toast({ title: 'Verarbeite Zustimmung...', description: 'Moment bitte...' });

    const pdfBlob = await generatePdfBlob();
    if (!pdfBlob) {
      toast({ variant: 'destructive', title: 'Fehler', description: 'Einwilligung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.' });
      setIsProcessing(false);
      return;
    }

    updateCoacheeConsent(coacheeId, 'gdpr', true, pdfBlob);
    setHasConsented(true);
    setIsProcessing(false);
    toast({
      title: "Vielen Dank für Ihre Zustimmung!",
      description: "Ihre Einwilligung wurde erfolgreich gespeichert und archiviert.",
      className: "bg-green-600 text-white border-green-700"
    });
  };

  if (isLoading) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!coachee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Card className="w-full max-w-lg glass-card text-center">
          <CardHeader>
            <CardTitle>Ungültiger Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">Der von Ihnen aufgerufene Link ist ungültig oder abgelaufen. Bitte kontaktieren Sie Ihren Coach.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const coacheeName = `${coachee.firstName} ${coachee.lastName}`;
  const coachName = settings.company.name || 'Ihrem Coach';

  return (
    <>
      <Helmet>
        <title>Einwilligung zur Datenverarbeitung - {coacheeName}</title>
        <meta name="description" content="Bitte erteilen Sie Ihre Einwilligung zur Verarbeitung Ihrer Daten im Rahmen des Coachings." />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {settings.company.logoUrl ? (
                  <img src={settings.company.logoUrl} alt="Firmenlogo" className="h-16 w-auto" />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">Einwilligung & Datenschutzerklärung</CardTitle>
              <p className="text-slate-400">Für das Coaching mit {coachName}</p>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-300">
  {hasConsented ? (
    <>
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Vielen Dank!</h3>
        <p className="mb-4">Ihre Einwilligung wurde bereits erteilt und ist gespeichert.</p>
        <p className="text-slate-400 mb-6">Falls Sie die Datenschutzerklärung nochmals als PDF benötigen:</p>
        <Button onClick={handleDownloadPdf} variant="outline" disabled={isProcessing}>
          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Als PDF herunterladen
        </Button>
      </div>
      
      {/* Privacy Policy hidden but in DOM for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', width: '800px' }}>
        <div ref={privacyPolicyRef}>
          <PrivacyPolicyContent coacheeName={coacheeName} coachName={coachName} />
        </div>
      </div>
    </>
  ) : (
    <>
      <p>Sehr geehrte/r <span className="font-bold text-white">{coacheeName}</span>,</p>
      <p>
        bitte lesen Sie die nachfolgende Datenschutzerklärung sorgfältig durch und erteilen Sie anschließend Ihre Zustimmung zur Verarbeitung Ihrer Daten.
      </p>
      
      <div className="mt-6 p-6 bg-slate-900/70 rounded-lg max-h-96 overflow-y-auto border border-slate-700">
        <div ref={privacyPolicyRef}>
          <PrivacyPolicyContent coacheeName={coacheeName} coachName={coachName} />
        </div>
      </div>

      <p className="pt-4">
        Sie können diese Einwilligung jederzeit widerrufen.
      </p>
    </>
  )}
</CardContent>
            {!hasConsented && (
              <CardFooter className="flex flex-col md:flex-row items-center justify-center gap-4">
                 <Button onClick={handleDownloadPdf} variant="outline" className="w-full md:w-auto" disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Als PDF herunterladen
                </Button>
                <Button onClick={handleConsent} className="w-full md:w-auto bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  {isProcessing ? 'Verarbeite...' : 'Ich stimme zu und habe die Erklärung gelesen'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ConsentPage;