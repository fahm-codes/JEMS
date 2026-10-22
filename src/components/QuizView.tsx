import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QAItem, VoiceSettings } from '../types';
import { speechEngine, soundFX } from '../utils/audio';

interface QuizViewProps {
  items: QAItem[];
  voiceSettings: VoiceSettings;
  streak: number;
  onAnswerResult: (isCorrect: boolean) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  items,
  voiceSettings,
  streak,
  onAnswerResult,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const currentQA = items[currentIndex] || items[0];

  const generateQuizQuestion = useCallback((targetIndex: number) => {
    if (!items.length) return;
    const current = items[targetIndex];
    const correctAns = current.a;

    // Pick 2 or 3 distinct distractor answers
    const otherAnswers = items
      .filter((_, idx) => idx !== targetIndex)
      .map((it) => it.a);

    // Shuffle and pick 2
    const shuffledDistractors = [...otherAnswers].sort(() => Math.random() - 0.5);
    const chosenOptions = [correctAns, ...shuffledDistractors.slice(0, 2)];
    
    // Shuffle all options
    chosenOptions.sort(() => Math.random() - 0.5);

    setOptions(chosenOptions);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedbackMessage('');
    setIsCorrect(false);

    // Prompt voice question
    speechEngine.speak(`Question: ${current.q}`, {
      voiceType: 'teacher',
      pitch: voiceSettings.teacherPitch,
      rate: voiceSettings.rate,
    });
  }, [items, voiceSettings]);

  useEffect(() => {
    if (items.length > 0) {
      const initialIdx = Math.floor(Math.random() * items.length);
      setCurrentIndex(initialIdx);
      generateQuizQuestion(initialIdx);
    }
  }, [items, generateQuizQuestion]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;

    setSelectedAnswer(opt);
    setIsAnswered(true);

    if (opt === currentQA.a) {
      setIsCorrect(true);
      setFeedbackMessage('🎉 Correct! Super job, little champion! 🌟');
      soundFX.playSuccess();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      speechEngine.speak('Correct! Great job, champion!', {
        voiceType: 'kid',
        pitch: voiceSettings.kidPitch,
        rate: voiceSettings.rate,
      });

      onAnswerResult(true);
    } else {
      setIsCorrect(false);
      setFeedbackMessage('💪 Good try! The correct answer is highlighted in green. Keep going!');
      soundFX.playError();

      speechEngine.speak('Try again next time!', {
        voiceType: 'kid',
        pitch: 1.2,
        rate: 0.95,
      });

      onAnswerResult(false);
    }
  };

  const handleNext = () => {
    soundFX.playPop();
    let nextIdx = Math.floor(Math.random() * items.length);
    if (nextIdx === currentIndex && items.length > 1) {
      nextIdx = (currentIndex + 1) % items.length;
    }
    setCurrentIndex(nextIdx);
    generateQuizQuestion(nextIdx);
  };

  const speakCurrentQuestion = () => {
    soundFX.playPop();
    speechEngine.speak(currentQA.q, {
      voiceType: 'teacher',
      pitch: voiceSettings.teacherPitch,
      rate: voiceSettings.rate,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border-4 border-indigo-200 text-center max-w-2xl mx-auto relative overflow-hidden">
      {/* Decorative Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce-slow">🎮</span>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-indigo-700">Fun Practice Quiz</h2>
            <p className="text-xs text-slate-500 font-semibold">Choose the correct answer for the question</p>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-800 font-bold text-xs sm:text-sm shadow-sm animate-pulse">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Streak: {streak}</span>
          </div>
        )}
      </div>

      {/* Question Card Box */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border-2 border-indigo-100 shadow-inner mb-6 space-y-3">
        <div className="inline-block text-4xl mb-1 bg-white p-2.5 rounded-2xl shadow-sm border border-indigo-100">
          {currentQA.emoji}
        </div>
        <p className="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">
          What is the right answer for:
        </p>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
          "{currentQA.q}"
        </h3>

        {currentQA.banglaQ && (
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            বাংলা অর্থ: {currentQA.banglaQ}
          </p>
        )}

        {/* Speak button for accessibility / listening */}
        <div className="pt-2">
          <button
            onClick={speakCurrentQuestion}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Question Again</span>
          </button>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto mb-6">
        {options.map((opt, i) => {
          let btnStyle = "bg-slate-50 hover:bg-indigo-50 text-slate-800 border-2 border-slate-200 hover:border-indigo-300";

          if (isAnswered) {
            if (opt === currentQA.a) {
              btnStyle = "bg-green-100 border-2 border-green-500 text-green-900 font-bold shadow-md scale-[1.02]";
            } else if (opt === selectedAnswer && opt !== currentQA.a) {
              btnStyle = "bg-rose-100 border-2 border-rose-400 text-rose-900 line-through opacity-80";
            } else {
              btnStyle = "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl text-sm sm:text-base font-semibold transition-all text-left flex items-center justify-between gap-3 ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentQA.a && (
                <span className="text-xl">✅</span>
              )}
              {isAnswered && opt === selectedAnswer && opt !== currentQA.a && (
                <span className="text-xl">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div className="space-y-4 animate-fade-in">
          <p className={`text-base sm:text-lg font-extrabold ${isCorrect ? 'text-green-600' : 'text-amber-700'}`}>
            {feedbackMessage}
          </p>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 rounded-2xl font-extrabold text-base shadow-lg shadow-green-200 transition transform hover:scale-105 active:scale-95"
          >
            <span>Next Question</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
