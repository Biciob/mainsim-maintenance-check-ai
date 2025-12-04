import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { QUESTIONS } from '../constants';
import { Answer, AnswerOption } from '../types';

interface QuestionnaireProps {
  onComplete: (answers: Record<number, Answer>) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [noteText, setNoteText] = useState('');

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (option: AnswerOption) => {
    const answer: Answer = {
      questionId: currentQuestion.id,
      selection: option,
      notes: noteText
    };

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      const nextStep = currentStep + 1;
      const nextQuestionId = QUESTIONS[nextStep].id;
      
      // If we have an existing answer for the next question, load its notes
      if (newAnswers[nextQuestionId]) {
        setNoteText(newAnswers[nextQuestionId].notes);
      } else {
        setNoteText(''); // Reset notes for new question
      }
      
      setCurrentStep(nextStep);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const prevQuestionId = QUESTIONS[prevStep].id;

      // Load existing notes for the previous question
      if (answers[prevQuestionId]) {
        setNoteText(answers[prevQuestionId].notes);
      } else {
        setNoteText('');
      }

      setCurrentStep(prevStep);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Domanda {currentStep + 1} di {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Completato</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 transition-all duration-500">
        <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase rounded-full">
                {currentQuestion.category}
            </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
          {currentQuestion.text}
        </h2>
        {currentQuestion.description && (
            <p className="text-slate-500 mb-8">
                {currentQuestion.description}
            </p>
        )}

        {/* Key added here ensures buttons are re-rendered (losing focus) when question changes */}
        <div key={currentQuestion.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['Sì', 'Parziale', 'No'] as AnswerOption[]).map((option) => {
            const isSelected = answers[currentQuestion.id]?.selection === option;
            
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 transition-all duration-200 group font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 bg-white'
                }`}
              >
                  {option === 'Sì' && <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-inherit' : 'text-green-500 group-hover:text-inherit'}`} />}
                  {option === 'No' && <Circle className={`w-5 h-5 ${isSelected ? 'text-inherit' : 'text-red-400 group-hover:text-inherit'}`} />}
                  {option === 'Parziale' && <Circle className={`w-5 h-5 ${isSelected ? 'text-inherit' : 'text-yellow-500 group-hover:text-inherit'}`} />}
                  {option}
              </button>
            );
          })}
        </div>

        {/* Optional Notes */}
        <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Note Opzionali (Contesto aggiuntivo per l'AI)
            </label>
            <textarea 
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm"
                rows={2}
                placeholder="Es. 'Usiamo Excel per ora' oppure 'Solo per asset critici'..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
            />
            
            <div className="mt-6 flex justify-between items-center">
                {currentStep > 0 ? (
                    <button 
                        onClick={handlePrevious}
                        className="flex items-center text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Indietro
                    </button>
                ) : (
                    <div /> /* Spacer */
                )}

                <span className="text-xs text-slate-400">
                    Premi una delle opzioni sopra per avanzare
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;