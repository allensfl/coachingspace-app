import{z as G,A as K,ad as R,i as $,d as H,r as u,j as e,H as Z,B as g,m as M,e as O,h as _,C as U,x as Q,F as q}from"./index-BCVF1PLb.js";import{I as J}from"./input-CMYn3E83.js";import{L as x}from"./label-gCXM_mwv.js";import{T as X}from"./textarea-Ei5qcXJt.js";import{S as p,a as j,b as N,c as v,d}from"./select-B5ckg96L.js";import{a as Y}from"./pdf-DOpULH4B.js";import{T as ee,a as se,b as D,c as T}from"./tabs-D-qa9ZUa.js";import{A as y}from"./arrow-left-BVjyKR_C.js";import{D as te}from"./download-DKg7zGZ5.js";import{S as ie}from"./save-BLsd0mx1.js";import{T as ne}from"./trash-2-Doau15tD.js";import{U as ae}from"./user-CaCbtgVu.js";import{E as re}from"./eye-B95wPRoU.js";import{M as ce,r as oe}from"./index-B6VHUN5s.js";import"./floating-ui.react-dom-DMRTrF13.js";import"./check-C26bXOMj.js";import"./jspdf.es.min-BgNKXESA.js";import"./de-B2K29ify.js";import"./index-CTsaMBSn.js";const F=[{id:"template_checkin",title:"Check-in & Ziel-Review",content:`## Check-in

- Wie geht es dir heute auf einer Skala von 1-10?
- Was hat dich diese Woche beschäftigt?
- Welchen Erfolg konntest du feiern?

## Ziel-Review

- Welche Fortschritte hast du bei deinen Zielen gemacht?
- Wo gab es Herausforderungen?
- Was hast du gelernt?

## Heutiger Fokus

- Was ist das wichtigste Thema für heute?
- Was wäre ein gutes Ergebnis für unsere heutige Session?

## Notizen



## Vereinbarungen & nächste Schritte

- `},{id:"template_reflection",title:"Reflexions-Session",content:`## Thema der Reflexion



## Schlüsselerkenntnisse

- 
- 
- 

## Aufgetauchte Gefühle & Gedanken

- 

## Neue Perspektiven

- 

## Konkrete Handlungsschritte

- `},{id:"template_decision",title:"Entscheidungsfindung",content:`## Die Entscheidung

Welche Entscheidung steht an?

## Optionen

1.  **Option A:** 
    - **Vorteile:** 
    - **Nachteile:** 
2.  **Option B:** 
    - **Vorteile:** 
    - **Nachteile:** 

## Wichtige Kriterien

- 
- 

## Bauchgefühl & Intuition

- 

## Getroffene Entscheidung & nächste Schritte

- `}];function De({isNew:r=!1}){const{id:S}=G(),c=K(),w=R(),{toast:a}=$(),{state:E,actions:V}=H(),{coachees:I,sessions:o,sessionNotes:C}=E,{setSessionNotes:b}=V,[t,h]=u.useState(null),[W,k]=u.useState(!0);u.useEffect(()=>{const s=new URLSearchParams(w.search),n=s.get("sessionId"),i=s.get("coacheeId");if(r){const l=o.find(f=>f.id===n);h({id:`note_${Date.now()}`,title:l?`Notiz für: ${l.topic}`:"Neue Sitzungsnotiz",content:"",coacheeId:i||"unassigned",sessionId:n||"unassigned",createdAt:new Date().toISOString()}),k(!1)}else{const l=C.find(f=>f.id===S);l?h(l):(a({title:"Fehler",description:"Notiz nicht gefunden.",variant:"destructive"}),c("/session-notes")),k(!1)}},[S,r,w.search,C,o,a,c]);const m=(s,n)=>{h(i=>({...i,[s]:n}))},L=s=>{const n=F.find(i=>i.id===s);n&&(h(i=>({...i,content:i.content?`${i.content}

${n.content}`:n.content})),a({title:"Vorlage eingefügt",description:`Die Vorlage "${n.title}" wurde zum Inhalt hinzugefügt.`}))},P=()=>{if(!t.title||!t.coacheeId||t.coacheeId==="unassigned"){a({title:"Fehler",description:"Bitte gib einen Titel an und wähle einen Coachee aus.",variant:"destructive"});return}b(s=>s.find(i=>i.id===t.id)?s.map(i=>i.id===t.id?t:i):[...s,t]),a({title:"Gespeichert!",description:"Die Sitzungsnotiz wurde erfolgreich gespeichert."}),r&&c(`/session-notes/${t.id}`)},A=()=>{b(s=>s.filter(n=>n.id!==t.id)),a({title:"Gelöscht!",description:"Die Notiz wurde entfernt.",variant:"destructive"}),c("/session-notes")},B=()=>{const s=I.find(i=>i.id===t.coacheeId),n=o.find(i=>i.id===t.sessionId);Y(t,s,n),a({title:"PDF wird generiert",description:"Dein Download startet in Kürze."})},z=u.useMemo(()=>t!=null&&t.coacheeId&&t.coacheeId!=="unassigned"?o.filter(s=>s.coacheeId===t.coacheeId):[],[t==null?void 0:t.coacheeId,o]);return W||!t?e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx(y,{className:"h-8 w-8 animate-spin"})}):e.jsxs(e.Fragment,{children:[e.jsxs(Z,{children:[e.jsxs("title",{children:[r?"Neue Notiz":t.title," - Coachingspace"]}),e.jsx("meta",{name:"description",content:"Erstelle und bearbeite detaillierte Sitzungsnotizen."})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(g,{variant:"ghost",onClick:()=>c("/session-notes"),children:[e.jsx(y,{className:"mr-2 h-4 w-4"})," Zurück zur Übersicht"]}),e.jsxs("div",{className:"flex gap-2",children:[!r&&e.jsxs(g,{variant:"outline",onClick:B,children:[e.jsx(te,{className:"mr-2 h-4 w-4"})," PDF"]}),e.jsxs(g,{onClick:P,children:[e.jsx(ie,{className:"mr-2 h-4 w-4"})," Speichern"]}),!r&&e.jsxs(g,{variant:"destructive",onClick:A,children:[e.jsx(ne,{className:"mr-2 h-4 w-4"})," Löschen"]})]})]}),e.jsx(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},children:e.jsx(O,{className:"glass-card",children:e.jsxs(_,{className:"p-6 space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(x,{htmlFor:"title",className:"text-lg",children:"Titel"}),e.jsx(J,{id:"title",value:t.title,onChange:s=>m("title",s.target.value),className:"text-2xl h-12"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs(x,{htmlFor:"coachee",className:"flex items-center gap-2",children:[e.jsx(ae,{className:"h-4 w-4"})," Coachee"]}),e.jsxs(p,{value:String(t.coacheeId),onValueChange:s=>m("coacheeId",s==="unassigned"?s:parseInt(s)),children:[e.jsx(j,{children:e.jsx(N,{placeholder:"Coachee auswählen..."})}),e.jsxs(v,{children:[e.jsx(d,{value:"unassigned",children:"Kein Coachee"}),I.map(s=>e.jsxs(d,{value:String(s.id),children:[s.firstName," ",s.lastName]},s.id))]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(x,{htmlFor:"session",className:"flex items-center gap-2",children:[e.jsx(U,{className:"h-4 w-4"})," Zugehörige Session"]}),e.jsxs(p,{value:t.sessionId,onValueChange:s=>m("sessionId",s),disabled:z.length===0,children:[e.jsx(j,{children:e.jsx(N,{placeholder:"Session auswählen..."})}),e.jsxs(v,{children:[e.jsx(d,{value:"unassigned",children:"Keine spezifische Session"}),z.map(s=>e.jsxs(d,{value:String(s.id),children:[s.topic," (",new Date(s.date).toLocaleDateString("de-DE"),")"]},s.id))]})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(x,{className:"flex items-center gap-2",children:[e.jsx(Q,{className:"h-4 w-4"})," Vorlagen"]}),e.jsxs(p,{onValueChange:L,children:[e.jsx(j,{children:e.jsx(N,{placeholder:"Vorlage zum Inhalt hinzufügen..."})}),e.jsx(v,{children:F.map(s=>e.jsx(d,{value:String(s.id),children:s.title},s.id))})]})]}),e.jsxs(ee,{defaultValue:"editor",className:"w-full",children:[e.jsxs(se,{className:"grid w-full grid-cols-2",children:[e.jsxs(D,{value:"editor",children:[e.jsx(q,{className:"mr-2 h-4 w-4"})," Editor"]}),e.jsxs(D,{value:"preview",children:[e.jsx(re,{className:"mr-2 h-4 w-4"})," Vorschau"]})]}),e.jsx(T,{value:"editor",children:e.jsx(X,{value:t.content,onChange:s=>m("content",s.target.value),placeholder:"Schreibe deine Notizen hier... Du kannst Markdown verwenden.",className:"min-h-[400px] mt-4 font-mono text-base"})}),e.jsx(T,{value:"preview",children:e.jsx("div",{className:"prose prose-invert prose-slate max-w-none p-4 mt-4 border border-slate-700 rounded-md min-h-[400px]",children:e.jsx(ce,{remarkPlugins:[oe],children:t.content||"Kein Inhalt für die Vorschau."})})})]})]})})})]})]})}export{De as default};
