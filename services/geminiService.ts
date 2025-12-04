import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Answer, AssessmentResult } from "../types";
import { SYSTEM_PROMPT } from "../constants";

// Define the expected JSON schema for the Gemini output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    readinessIndex: {
      type: Type.INTEGER,
      description: "Punteggio globale da 0 a 100",
    },
    cluster: {
      type: Type.STRING,
      description: "Livello di maturità: Basso, Medio, o Alto",
    },
    radarData: {
      type: Type.OBJECT,
      properties: {
        "Asset Management": { type: Type.INTEGER },
        "Preventiva": { type: Type.INTEGER },
        "Workflow": { type: Type.INTEGER },
        "KPI & Reporting": { type: Type.INTEGER },
        "Digitalizzazione": { type: Type.INTEGER },
      },
      required: ["Asset Management", "Preventiva", "Workflow", "KPI & Reporting", "Digitalizzazione"],
    },
    executiveSummary: {
      type: Type.STRING,
      description: "Breve commento diagnostico generale (max 3 righe).",
    },
    detailedAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: { type: Type.STRING },
          status: { type: Type.STRING, description: "Es. Maturità intermedia, Gap critico" },
          risks: { type: Type.STRING, description: "Rischi principali associati allo stato attuale" },
          opportunities: { type: Type.STRING, description: "Opportunità di miglioramento immediate" },
        },
        required: ["area", "status", "risks", "opportunities"],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 raccomandazioni operative specifiche.",
    },
  },
  required: ["readinessIndex", "cluster", "radarData", "executiveSummary", "detailedAnalysis", "recommendations"],
};

export const generateAssessment = async (answers: Record<number, Answer>): Promise<AssessmentResult> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  // Format answers for the prompt
  const answersText = Object.values(answers)
    .map(
      (a, idx) =>
        `Domanda ${idx + 1}: [ID: ${a.questionId}] Risposta: ${a.selection}. Note utente: ${
          a.notes || "Nessuna nota"
        }`
    )
    .join("\n");

  const prompt = `
    Ecco le risposte dell'utente al questionario di valutazione CMMS:
    
    ${answersText}

    Genera il report di valutazione in formato JSON seguendo lo schema definito.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for consistent, analytical results
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Risposta vuota dall'AI.");
    }

    const parsedResult = JSON.parse(jsonText) as AssessmentResult;
    return parsedResult;
  } catch (error) {
    console.error("Errore durante la generazione dell'assessment:", error);
    throw error;
  }
};
