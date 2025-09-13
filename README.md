# Coachingspace - Entwicklerdokumentation

Dieses Repository enthält den Quellcode für die Coachingspace App, eine professionelle Coaching-Anwendung. Diese Dokumentation richtet sich an Entwickler. Eine separate, benutzerfreundliche Dokumentation für Coaches finden Sie in der Datei `DOKUMENTATION.md`.

## 🎯 Vision

Coachingspace ist eine Local-First, Offline-First Coaching-App mit DSGVO-by-Design Prinzipien. Die App unterstützt Coaches bei ihrer täglichen Arbeit, ohne dabei Coachee-Daten zu analysieren - ethische KI steht im Vordergrund.

## 🛠 Technologie-Stack

- **Frontend**: React 18.2.0 mit Vite als Build-Tool
- **Styling**: TailwindCSS
- **UI-Komponenten**: shadcn/ui (basierend auf Radix UI Primitives)
- **Icons**: Lucide React
- **Animationen**: Framer Motion
- **Routing**: React Router 6.16.0
- **State Management**: React Context API (`useAppStateContext`)
- **Datenhaltung**: LocalStorage für den Prototyp-Status

## 📦 Installation & Start

Stellen Sie sicher, dass Node.js (Version 20 oder höher) und npm installiert sind.

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Development-Server starten
npm run dev

# 3. Produktiv-Build erstellen
npm run build

# 4. Build lokal testen
npm run preview
```

Die App ist dann unter `http://localhost:5173` (oder einem anderen von Vite zugewiesenen Port) erreichbar.

## 📁 Projekt-Struktur

Die Projektstruktur ist modular aufgebaut, um eine klare Trennung der Verantwortlichkeiten zu gewährleisten.

```
src/
├── assets/              # Statische Dateien wie Schriftarten
├── components/          # Wiederverwendbare React-Komponenten
│   ├── ui/              # Basis-UI-Komponenten von shadcn/ui
│   ├── ai-coaching/     # Komponenten für das KI-Modul
│   ├── coachee-detail/  # Komponenten für die Coachee-Detailansicht
│   ├── coachee-portal/  # Komponenten für das Coachee-Portal
│   ├── invoice-creator/ # Komponenten für den Rechnungseditor
│   └── ...              # Weitere Hauptkomponenten (Dashboard, Sessions etc.)
├── context/             # React Context für das State Management
│   └── AppStateContext.jsx # Globaler App-Zustand
├── data/                # Dummy-Daten für die Entwicklung
├── lib/                 # Hilfsfunktionen und Bibliotheks-Wrapper
├── routes/              # Routing-Konfiguration
│   └── index.jsx        # Definition aller App-Routen
├── types.js             # Typ-Definitionen und Enums
├── App.jsx              # Haupt-App-Komponente
├── main.jsx             # Einstiegspunkt der Anwendung
└── index.css            # Globale CSS-Stile
```

## 🎨 Design-Prinzipien

- **Industrial-Dark-Design**: Eine dunkle, professionelle Farbpalette mit Akzenten. Glassmorphism-Effekte werden für eine moderne Ästhetik eingesetzt.
- **Responsive Design**: Die Anwendung ist für Desktop, Tablet und Mobilgeräte optimiert.
- **Fokus auf UX**: Klare Layouts, intuitive Navigation und durchdachte Animationen sollen die Benutzererfahrung verbessern.

## 🔒 Datenschutz & Datenhaltung

- **Local-First**: Im aktuellen Prototyp-Stadium werden alle Daten ausschließlich im `localStorage` des Browsers gespeichert. Es findet keine Kommunikation mit einem externen Server statt.
- **DSGVO-Konformität**: Das Design der App folgt den Prinzipien der DSGVO. Features wie der Consent-Flow sind fest integriert.
- **Keine Cloud-Abhängigkeiten**: Die Kernfunktionalität ist nicht von externen Cloud-Diensten abhängig.
- **Daten-Backup**: Benutzer können jederzeit ein vollständiges Backup ihrer Daten als JSON-Datei exportieren.

## 🔮 Roadmap (Technische Perspektive)

- **Phase 2 (Geplant)**:
  - Umstellung auf eine Desktop-App (mittels Electron oder Tauri).
  - Ersetzen von `localStorage` durch eine lokale SQLite-Datenbank für robustere und performantere Datenhaltung.
  - Implementierung einer vollständigen Offline-Funktionalität.
  - Einführung eines sicheren Daten-Imports.

- **Phase 3 (Vision)**:
  - Optionale, Ende-zu-Ende-verschlüsselte Synchronisation zwischen Geräten.
  - Integration von externen APIs (z.B. Kalender, Video-Tools) über ein sicheres Backend.
  - Erweiterung der KI-Funktionen mit Fokus auf ethische Grundsätze und Datenschutz.

## 🤝 Mitwirken

- **Issues & Feature Requests**: Bitte nutzen Sie den Issue-Tracker des Repositories, um Fehler zu melden oder neue Funktionen vorzuschlagen.
- **Code-Beiträge**: Pull Requests sind willkommen. Bitte halten Sie sich an den bestehenden Code-Stil und stellen Sie sicher, dass Ihr Code die bestehenden Funktionalitäten nicht beeinträchtigt.

## 📄 Lizenz

Dieses Projekt ist ein Prototyp und für Demonstrationszwecke gedacht. Eine produktive Nutzung wird erst nach Erreichen der Meilensteine aus Phase 2 empfohlen.
