import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InvalidLinkPage = () => {
  return (
    <>
      <Helmet>
        <title>Ungültiger Link - Coachingspace</title>
        <meta name="description" content="Der aufgerufene Link ist ungültig oder abgelaufen." />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="glass-card max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto bg-red-500/10 p-4 rounded-full w-fit">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mt-4">Link ungültig oder abgelaufen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-6">
              Der Link, den Sie aufgerufen haben, ist leider nicht mehr gültig. Dies kann passieren, wenn es sich um einen Einmal-Link handelt, der bereits verwendet wurde.
            </p>
            <p className="text-slate-400 mb-6">
              Wenn Sie Coachee sind, kontaktieren Sie bitte Ihren Coach, um einen neuen Zugangslink zu erhalten.
            </p>
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Zurück zur Startseite
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvalidLinkPage;