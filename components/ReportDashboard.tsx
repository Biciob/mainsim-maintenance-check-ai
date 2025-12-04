import React, { useState } from 'react';
import { AssessmentResult } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Download, CheckCircle, AlertTriangle, Lightbulb, BarChart3, Loader2 } from 'lucide-react';

interface ReportDashboardProps {
  result: AssessmentResult;
  onReset: () => void;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ result, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Transform key-value object to array for Recharts
  const chartData = Object.entries(result.radarData).map(([subject, A]) => ({
    subject,
    A,
    fullMark: 100,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 print:text-green-800 print:bg-transparent';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 print:text-yellow-700 print:bg-transparent';
    return 'text-red-600 bg-red-50 print:text-red-700 print:bg-transparent';
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    // Allow React to render the visibility changes (show header, hide buttons)
    await new Promise(resolve => setTimeout(resolve, 500));

    const element = document.getElementById('report-container');
    
    // Configuration for html2pdf
    const opt = {
      margin: 10,
      filename: `Mainsim_CMMS_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        // @ts-ignore
        if (window.html2pdf) {
            // @ts-ignore
            await window.html2pdf().set(opt).from(element).save();
        } else {
            console.warn("html2pdf library not found, falling back to window.print()");
            window.print();
        }
    } catch (e) {
        console.error("Download failed", e);
        window.print();
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div id="report-container" className="w-full max-w-5xl mx-auto space-y-8 pb-20 print:pb-0 print:space-y-6">
      
      {/* CSS For Print Layout Fallback */}
      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:flex {
            display: flex !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          .recharts-responsive-container {
             height: 400px !important;
          }
        }
      `}</style>

      {/* Brand Header: Visible during Print AND during PDF Download */}
      <div className={`${isDownloading ? 'flex' : 'hidden'} print:flex items-center gap-3 border-b border-slate-200 pb-4 mb-8`}>
         <div className="bg-indigo-600 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
         </div>
         <div>
            <h1 className="text-xl font-bold text-slate-900">Maintenance Check AI</h1>
            <p className="text-sm text-slate-500">Powered by mainsim</p>
         </div>
      </div>

      {/* Screen Header Section with Actions */}
      <div className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 print:shadow-none print:border-none print:p-0 ${isDownloading ? 'border-none shadow-none p-0' : ''}`}>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CMMS Readiness Report</h1>
          <p className="text-slate-500">Analisi generata dall'Intelligenza Artificiale sulla base delle tue risposte.</p>
        </div>
        {/* Actions are hidden during download/print */}
        <div className={`${isDownloading ? 'hidden' : 'flex'} gap-3 print:hidden`}>
            <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
            >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isDownloading ? 'Generazione...' : 'Salva PDF'}</span>
            </button>
        </div>
      </div>

      {/* Top Cards: Score & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center lg:col-span-1 print:col-span-1 print:shadow-none print:border print:border-slate-300">
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider mb-4">Readiness Index</h3>
            <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-8 mb-4 ${
                result.readinessIndex >= 80 ? 'border-green-100 print:border-green-200' : result.readinessIndex >= 50 ? 'border-yellow-100 print:border-yellow-200' : 'border-red-100 print:border-red-200'
            }`}>
                <span className={`text-5xl font-extrabold ${
                    result.readinessIndex >= 80 ? 'text-green-600' : result.readinessIndex >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                    {result.readinessIndex}
                </span>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${getScoreColor(result.readinessIndex)}`}>
                Livello {result.cluster}
            </span>
            <p className="mt-6 text-sm text-slate-600 italic">
                "{result.executiveSummary}"
            </p>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 lg:col-span-2 flex flex-col print:col-span-2 print:shadow-none print:border print:border-slate-300">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 px-4 pt-4">Mappatura delle Competenze</h3>
            <div className="flex-1 min-h-[300px] w-full print:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Punteggio Aziendale"
                            dataKey="A"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fill="#6366f1"
                            fillOpacity={0.3}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#4338ca', fontWeight: 600 }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="break-before-auto">
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Analisi Dettagliata "As Is"</h2>
        <div className="grid grid-cols-1 gap-6">
            {result.detailedAnalysis.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow break-inside-avoid print:shadow-none print:border-slate-300">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center print:bg-slate-100">
                        <h3 className="font-bold text-slate-800">{item.area}</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded text-slate-600">
                            {item.status}
                        </span>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-start gap-2 mb-2 text-red-600 font-medium text-sm uppercase tracking-wide">
                                <AlertTriangle className="w-4 h-4" /> Rischi
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.risks}</p>
                        </div>
                        <div>
                            <div className="flex items-start gap-2 mb-2 text-indigo-600 font-medium text-sm uppercase tracking-wide">
                                <Lightbulb className="w-4 h-4" /> Opportunità
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.opportunities}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Recommendations & CTA */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-8 text-white shadow-xl mt-12 print:bg-none print:text-black print:border print:border-slate-300 print:shadow-none break-inside-avoid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-8">
            <div>
                <h2 className="text-2xl font-bold mb-6 print:text-indigo-900">Raccomandazioni Prioritarie</h2>
                <ul className="space-y-4">
                    {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-indigo-300 flex-shrink-0 mt-0.5 print:text-indigo-600" />
                            <span className="text-indigo-50 leading-relaxed print:text-slate-700">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Hidden only during Print/Download, visible on screen */}
            <div className={`${isDownloading ? 'hidden' : 'flex'} flex-col justify-center items-center bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20 text-center print:hidden`}>
                <h3 className="text-xl font-bold mb-2">Vuoi approfondire l'analisi?</h3>
                <p className="text-indigo-200 mb-6 text-sm">
                    I nostri esperti possono aiutarti a implementare queste raccomandazioni e colmare i gap identificati.
                </p>
                <div className="space-y-3 w-full">
                    <a 
                        href="https://www.mainsim.com/contatti/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-4 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        Prenota una Discovery Call
                    </a>
                    <button 
                        onClick={onReset}
                        className="w-full py-3 px-4 bg-transparent border border-indigo-400 text-indigo-100 font-medium rounded-lg hover:bg-indigo-800/50 transition-colors"
                    >
                        Ricomincia il Test
                    </button>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default ReportDashboard;