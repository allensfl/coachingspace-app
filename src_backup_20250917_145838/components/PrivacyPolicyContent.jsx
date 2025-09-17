import React from 'react';

export default function PrivacyPolicyContent({ coacheeName, coachName }) {
    const currentDate = new Date().toLocaleDateString('de-DE');

    return (
        <div className="prose prose-invert prose-slate max-w-none text-slate-300">
            <h1 className="text-white">Datenschutzerklärung</h1>
            <p>Stand: {currentDate}</p>
            
            <h2 className="text-white">1. Präambel</h2>
            <p>
                Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten (nachfolgend „Daten“) innerhalb unseres Coaching-Angebots auf. Verantwortlicher für die Datenverarbeitung ist <strong>{coachName}</strong>.
            </p>

            <h2 className="text-white">2. Art der verarbeiteten Daten</h2>
            <p>Im Rahmen des Coachings werden folgende Daten verarbeitet:</p>
            <ul>
                <li><strong>Stammdaten:</strong> Name, Vorname (von {coacheeName || 'Ihnen'}).</li>
                <li><strong>Kontaktdaten:</strong> E-Mail-Adresse, Telefonnummer.</li>
                <li><strong>Inhaltsdaten:</strong> Notizen zu den Sitzungen, Ihre Ziele, Ergebnisse von Übungen und eingesetzten Tools, von Ihnen bereitgestellte Dokumente.</li>
                <li><strong>Vertragsdaten:</strong> Informationen zu gebuchten Paketen und Rechnungsdaten.</li>
                <li><strong>Metadaten:</strong> Datum und Uhrzeit der Sitzungen.</li>
            </ul>

            <h2 className="text-white">3. Zweck der Verarbeitung</h2>
            <p>Die Verarbeitung Ihrer Daten erfolgt ausschließlich zu folgenden Zwecken:</p>
            <ul>
                <li>Zur Durchführung des Coaching-Vertrags und zur Erbringung der vereinbarten Leistungen.</li>
                <li>Zur Kommunikation im Rahmen der Coaching-Beziehung.</li>
                <li>Zur Dokumentation des Coaching-Prozesses für eine kontinuierliche und professionelle Begleitung.</li>
                <li>Zur Erfüllung gesetzlicher Aufbewahrungspflichten (z. B. im Rahmen der Rechnungslegung).</li>
            </ul>

            <h2 className="text-white">4. Rechtsgrundlagen</h2>
            <p>
                Die Verarbeitung Ihrer Daten stützt sich auf Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie auf Ihre ausdrückliche Einwilligung gemäß Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a DSGVO, insbesondere für die Verarbeitung von besonderen Kategorien personenbezogener Daten (Gesprächsinhalte), die sich im Laufe des Coachings ergeben können.
            </p>

            <h2 className="text-white">5. Vertraulichkeit und Sicherheit</h2>
            <p>
                Ich, <strong>{coachName}</strong>, unterliege der Verschwiegenheitspflicht. Alle Ihre Daten werden streng vertraulich behandelt. Ich treffe umfangreiche technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
            </p>

            <h2 className="text-white">6. Speicherdauer</h2>
            <p>
                Ihre Daten werden nur so lange gespeichert, wie es für die Erreichung der oben genannten Zwecke erforderlich ist oder wie es die gesetzlichen Aufbewahrungsfristen (z. B. aus dem Handels- oder Steuerrecht) vorschreiben. Nach Wegfall des Zwecks bzw. Ablauf der Fristen werden Ihre Daten gelöscht.
            </p>

            <h2 className="text-white">7. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht auf:</p>
            <ul>
                <li><strong>Auskunft</strong> über die zu Ihrer Person gespeicherten Daten.</li>
                <li><strong>Berichtigung</strong> unrichtiger Daten.</li>
                <li><strong>Löschung</strong> Ihrer Daten, sofern keine rechtlichen Pflichten entgegenstehen.</li>
                <li><strong>Einschränkung der Verarbeitung</strong> Ihrer Daten.</li>
                <li><strong>Widerspruch</strong> gegen die Verarbeitung.</li>
                <li><strong>Datenübertragbarkeit</strong>.</li>
            </ul>
            <p>
                Sie haben zudem das Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen. Bitte wenden Sie sich hierfür an mich.
            </p>

            {coacheeName && (
                <>
                <h2 className="text-white">Einwilligungserklärung</h2>
                <p>
                    Hiermit bestätige ich, <strong>{coacheeName}</strong>, die obenstehende Datenschutzerklärung gelesen und verstanden zu haben. Ich willige in die beschriebene Verarbeitung meiner personenbezogenen Daten zum Zweck der Durchführung des Coachings ein.
                </p>
                </>
            )}

            <p><strong>Datum:</strong> {currentDate}</p>
        </div>
    );
}