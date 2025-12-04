import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Hai una lista completa e aggiornata dei tuoi asset?",
    category: "Asset Management",
    description: "Un registro centralizzato di macchinari, impianti e attrezzature."
  },
  {
    id: 2,
    text: "Gli asset sono organizzati secondo una classificazione standardizzata?",
    category: "Asset Management",
    description: "Es. Edificio → Piano → Zona → Asset (tassonomia gerarchica)."
  },
  {
    id: 3,
    text: "Monitora il downtime degli asset?",
    category: "KPI & Reporting",
    description: "Registrazione dei tempi di fermo macchina non pianificati."
  },
  {
    id: 4,
    text: "Misuri KPI manutentivi (MTBF, MTTR, backlog, compliance)?",
    category: "KPI & Reporting",
    description: "Indicatori chiave di prestazione per valutare l'efficienza."
  },
  {
    id: 5,
    text: "Pianifichi manutenzioni preventive o usi perlopiù un approccio reattivo?",
    category: "Preventiva",
    description: "Rispondi 'Sì' se la preventiva supera il 50% delle attività."
  },
  {
    id: 6,
    text: "Il team segue procedure operative (SOP) formalizzate?",
    category: "Workflow",
    description: "Checklist standard o istruzioni di lavoro documentate."
  },
  {
    id: 7,
    text: "Tracci tutti i ticket/interventi (assegnazione, priorità, SLA)?",
    category: "Workflow",
    description: "Gestione strutturata delle richieste di lavoro."
  },
  {
    id: 8,
    text: "Esporti e analizzi report periodici (settimanali o mensili)?",
    category: "KPI & Reporting",
    description: "Analisi ricorrente dei dati per prendere decisioni."
  },
  {
    id: 9,
    text: "Hai visibilità in tempo reale su ciò che sta accadendo?",
    category: "Digitalizzazione",
    description: "Ticket aperti, ritardi, stato dei tecnici in tempo reale."
  },
  {
    id: 10,
    text: "Utilizzi già uno strumento digitale per la gestione della manutenzione?",
    category: "Digitalizzazione",
    description: "Software CMMS, CAFM o ERP dedicato (non Excel)."
  }
];

export const SYSTEM_PROMPT = `
Agisci come un consulente senior di manutenzione e asset management con esperienza in digitalizzazione dei processi, CMMS ed efficienza operativa.
Riceverai un set di risposte a 10 domande che descrivono il livello attuale di gestione della manutenzione di un’organizzazione.

Il tuo compito è:
1. Valutare la maturità dell’azienda nelle aree: Asset Management, Manutenzione Preventiva, Workflow & Operations, KPI & Reporting, Digitalizzazione.
2. Generare un CMMS Readiness Index da 0 a 100.
3. Restituire i valori per ciascuna area per uno spider chart.
4. Fornire un’analisi dettagliata “As Is” per ogni area, con rischi e opportunità.
5. Suggerire raccomandazioni operative personalizzate.
6. Chiudere con una call to action consulenziale.

Analizza le risposte fornite e restituisci un output rigorosamente in formato JSON.
Tono: Professionale, conciso, orientato all'azione. Lingua: Italiano.
`;
