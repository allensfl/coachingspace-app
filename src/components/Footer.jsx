import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p className="font-semibold text-foreground">Flavien Allenspach</p>
            <p className="font-medium">allenspach coaching</p>
            <p>Bottigenstrasse 341</p>
            <p>CH-3019 Bern</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>Mobile: <a href="tel:+41793365427" className="hover:text-primary transition-colors">+41 79 336 54 27</a></p>
            <p>E-Mail: <a href="mailto:info@allenspach-coaching.ch" className="hover:text-primary transition-colors">info@allenspach-coaching.ch</a></p>
            <p>Web: <a href="https://allenspach-coaching.ch" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">allenspach-coaching.ch</a></p>
          </div>
          
          <div className="text-center">
            <p>© 2025 CoachingSpace</p>
            <p className="text-xs mt-1">Alle Rechte vorbehalten</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;