import React, { useState } from 'react';
import { Answer, AssessmentResult } from './types';
import Questionnaire from './components/Questionnaire';
import ReportDashboard from './components/ReportDashboard';
import { generateAssessment } from './services/geminiService';
import { BarChart3, ChevronRight, Loader2 } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<'intro' | 'quiz' | 'loading' | 'results' | 'error'>('intro');
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const startQuiz = () => {
    setStatus('quiz');
  };

  const handleQuizCompletion = async (completedAnswers: Record<number, Answer>) => {
    setAnswers(completedAnswers);
    setStatus('loading');
    try {
      const data = await generateAssessment(completedAnswers);
      setResult(data);
      setStatus('results');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const resetApp = () => {
    setAnswers({});
    setResult(null);
    setStatus('intro');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar / Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">Maintenance Check AI <span className="font-normal text-slate-500 text-sm ml-1">by mainsim</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
               <a 
                 href="https://www.mainsim.com/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
               >
                 Torna al sito
               </a>
               <a 
                 href="https://www.mainsim.com/contatti/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-sm font-medium bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
               >
                 Contatta Esperto
               </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-64px)] print:p-0 print:block">
        
        {/* State: Intro */}
        {status === 'intro' && (
          <div className="max-w-3xl text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-2">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Valutazione Gratuita Potenziata da AI
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Scopri il livello di maturità della tua <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">manutenzione</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              In meno di 3 minuti, analizza i tuoi processi operativi e ricevi un report personalizzato con un "Readiness Score" e raccomandazioni pratiche per migliorare l'efficienza.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                    onClick={startQuiz}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1"
                >
                    Inizia Assessment
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-70">
                <div>
                    <div className="font-bold text-3xl text-slate-800">10</div>
                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">Domande</div>
                </div>
                <div>
                    <div className="font-bold text-3xl text-slate-800">ISO</div>
                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">55000 Ready</div>
                </div>
                <div>
                    <div className="font-bold text-3xl text-slate-800">AI</div>
                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">Analysis</div>
                </div>
                <div>
                    <div className="font-bold text-3xl text-slate-800">100%</div>
                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">Gratuito</div>
                </div>
            </div>
          </div>
        )}

        {/* State: Quiz */}
        {status === 'quiz' && (
            <Questionnaire onComplete={handleQuizCompletion} />
        )}

        {/* State: Loading */}
        {status === 'loading' && (
            <div className="text-center">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analisi in corso...</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Stiamo confrontando le tue risposte con le best practice di settore per generare il tuo report personalizzato.
                </p>
            </div>
        )}

        {/* State: Results */}
        {status === 'results' && result && (
            <ReportDashboard result={result} onReset={resetApp} />
        )}

        {/* State: Error */}
        {status === 'error' && (
            <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg border border-red-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Si è verificato un errore</h2>
                <p className="text-slate-600 mb-6">
                    Non siamo riusciti a generare il report. Potrebbe trattarsi di un problema di connessione o di API limit.
                </p>
                <button 
                    onClick={resetApp}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Riprova
                </button>
            </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            ©2025 mainsim - what maintenance can be | Designed with ❤️ for Maintenance Professionals
        </div>
      </footer>
    </div>
  );
}

export default App;