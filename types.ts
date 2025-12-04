export type AnswerOption = 'Sì' | 'No' | 'Parziale';

export interface Question {
  id: number;
  text: string;
  category: string;
  description?: string;
}

export interface Answer {
  questionId: number;
  selection: AnswerOption;
  notes: string;
}

export interface RadarData {
  "Asset Management": number;
  "Preventiva": number;
  "Workflow": number;
  "KPI & Reporting": number;
  "Digitalizzazione": number;
}

export interface AssessmentResult {
  readinessIndex: number;
  cluster: string; // 'Basso', 'Medio', 'Alto'
  radarData: RadarData;
  executiveSummary: string;
  detailedAnalysis: Array<{
    area: string;
    status: string; // e.g., "Gap Critico"
    risks: string;
    opportunities: string;
  }>;
  recommendations: string[];
}
