import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, RefreshCw, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QAItem, VoiceSettings } from '../types';
import { speechEngine, soundFX } from '../utils/audio';

interface SentenceBuilderViewProps {
  items: QAItem[];
  voiceSettings: VoiceSettings;
  onSuccess: () => void;
}

export const SentenceBuilderView: React.FC<SentenceBuilderViewProps> = ({
  items,
  voiceSettings,
  onSuccess,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);

  const currentQA = items[currentIndex] || items[0];

  const setupSentence = (idx: number) => {
    if (!items.length) return;
    const item = items[idx];
    const words = item.a.split(/\s+/).filter(Boolean);
    
    // Scramble words ensuring they aren't in exact initial order if length > 1
    const scrambled = [...words].sort(() => Math.random() - 0.5);
    setScrambledWords(scrambled);
    setSelectedWords([]);
    setIsCompleted(false);
    setIsError(false);

    // Speak Question
    speechEngine.speak(`Build the answer for: ${item.q}`, {
      voiceType: 'teacher',
      pitch: voiceSettings.teacherPitch,
      rate: voiceSettings.rate,
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      setupSentence(currentIndex);
    }
  }, [currentIndex, items]);

  const handleSelectWord = (word: string, indexInScrambled: number) => {
    if (isCompleted) return;
    soundFX.playPop();

    // Remove from scrambled, add to selected
    const newScrambled = [...scrambledWords];
    newScrambled.splice(indexInScrambled, 1);
    setScrambledWords(newScrambled);
    setSelectedWords([...selectedWords, word]);
    setIsError(false);
  };

  const handleRemoveWord = (word: string, indexInSelected: number) => {
    if (isCompleted) return;
    soundFX.playPop();

    // Remove from selected, return to scrambled
    const newSelected = [...selectedWords];
    newSelected.splice(indexInSelected, 1);
    setSelectedWords(newSelected);
    setScrambledWords([...scrambledWords, word]);
    setIsError(false);
  };

  const handleCheck = () => {
    const constructedSentence = selectedWords.join(' ');
    const targetSentence = currentQA.a;

    // Compare text normalized
    const cleanConstructed = constructedSentence.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTarget = targetSentence.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanConstructed === cleanTarget) {
      setIsCompleted(true);
      setIsError(false);
      soundFX.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      speechEngine.speak(currentQA.a, {
        voiceType: 'kid',
        pitch: voiceSettings.kidPitch,
        rate: voiceSettings.rate,
      });

      onSuccess();
    } else {
      setIsError(true);
      soundFX.playError();
      speechEngine.speak('Almost there! Try rearranging the words.', {
        voiceType: 'kid',
        pitch: 1.2,
        rate: 0.95,
      });
    }
  };

  const handleNext = () => {
    soundFX.playPop();
    const nextIdx = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIdx);
    setupSentence(nextIdx);
  };

  const handleHearHint = () => {
    soundFX.playPop();
    speechEngine.speak(currentQA.a, {
      voiceType: 'teacher',
      pitch: voiceSettings.teacherPitch,
      rate: 0.8, // slower for hint
    });
  };

  const handleReset = () => {
    soundFX.playPop();
    setupSentence(currentIndex);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border-4 border-emerald-200 text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce-slow">🧩</span>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-800">Sentence Word Builder</h2>
            <p className="text-xs text-slate-500 font-semibold">Tap words to build the right English answer!</p>
          </div>
        </div>

        <button
          onClick={handleHearHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 text-xs font-bold transition active:scale-95"
          title="Listen to audio hint"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Audio Hint</span>
        </button>
      </div>

      {/* Target Question Box */}
      <div className="bg-emerald-50/70 p-5 rounded-3xl border-2 border-emerald-100 mb-6">
        <span className="text-3xl mb-1 block select-none">{currentQA.emoji}</span>
        <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
          Question #{currentIndex + 1}
        </span>
        <h3 className="text-xl font-black text-slate-800 mt-1">
          Q. {currentQA.q}
        </h3>
        {currentQA.banglaQ && (
          <p className="text-xs sm:text-sm text-emerald-700 font-semibold mt-1">
            বাংলা: {currentQA.banglaQ}
          </p>
        )}
      </div>

      {/* Answer Slots Box */}
      <div className="mb-6">
        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          Your Sentence (Tap a word to remove):
        </div>
        <div className="min-h-[70px] p-4 bg-slate-50 border-3 border-dashed border-emerald-300 rounded-2xl flex flex-wrap gap-2 items-center justify-center">
          {selectedWords.length === 0 ? (
            <span className="text-slate-400 text-sm font-medium italic">
              Tap words below to arrange them here...
            </span>
          ) : (
            selectedWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveWord(word, idx)}
                className="bg-emerald-600 hover:bg-rose-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-sm text-sm sm:text-base transition transform active:scale-95 hover:line-through"
                title="Click to remove"
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Scrambled Word Pool */}
      <div className="mb-6">
        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          Available Words (Tap to place):
        </div>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {scrambledWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectWord(word, idx)}
              className="bg-white hover:bg-emerald-50 text-slate-800 border-2 border-slate-300 hover:border-emerald-500 font-bold px-4 py-2 rounded-xl text-sm sm:text-base shadow-sm transition active:scale-95"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Action / Result Area */}
      <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-3">
        {isError && (
          <p className="text-rose-600 font-bold text-sm animate-wiggle">
            ❌ Not quite right yet! Tap the incorrect word to return it or listen to the hint!
          </p>
        )}

        {isCompleted ? (
          <div className="space-y-3">
            <p className="text-green-600 font-extrabold text-lg">
              🎉 Brilliant! You built the sentence perfectly! 🌟
            </p>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black text-base shadow-lg transition active:scale-95"
            >
              <span>Next Sentence</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCheck}
              disabled={selectedWords.length === 0}
              className="px-8 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              Check My Sentence ✅
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
