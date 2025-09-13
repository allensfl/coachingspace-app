
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { de } from 'date-fns/locale';

const SessionCalendarView = ({ date, setDate, sessions, onDayClick }) => {
  return (
    <Card className="glass-card mt-6">
      <CardContent className="p-2 sm:p-6">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
          locale={de}
          classNames={{
            root: "w-full",
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-white",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-slate-400 rounded-md w-full font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-24 w-full text-center text-sm p-1 relative [&:has([aria-selected])]:bg-slate-800/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 rounded-md",
            day_today: "bg-slate-800 text-white rounded-md",
            day_outside: "text-slate-500 opacity-50",
            day_disabled: "text-slate-500 opacity-50",
            day_hidden: "invisible",
          }}
          components={{
            DayContent: ({ date }) => {
              const daySessions = sessions.filter(s => new Date(s.date).toDateString() === date.toDateString());
              return (
                <div className="h-full w-full flex flex-col items-start p-1">
                  <time dateTime={date.toISOString()}>{date.getDate()}</time>
                  <div className="flex-grow w-full overflow-y-auto text-left mt-1">
                    {daySessions.map(s => (
                      <div key={s.id} className="text-xs p-1 rounded-sm bg-blue-900/50 mb-1 truncate" onClick={() => onDayClick(s)}>
                        {s.topic}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SessionCalendarView;
