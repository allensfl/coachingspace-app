import React from 'react';
import { motion } from 'framer-motion';
import { History, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuditLogCard = ({ auditLog }) => {
  const sortedLog = [...(auditLog || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="mr-2 h-5 w-5" />
            Audit Log / Verlauf
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sortedLog.length > 0 ? (
              sortedLog.map((log, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{log.action}</p>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(log.timestamp).toLocaleString('de-DE')}</span>
                      <span>durch {log.user}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Keine Verlaufseinträge vorhanden.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuditLogCard;