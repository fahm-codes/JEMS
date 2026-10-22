import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QAItem, VoiceSettings } from '../types';
import { speechEngine, soundFX } from '../utils/audio';

interface ListeningChallengeViewProps {
  items: QAItem[];
  voiceSettings: VoiceSettings;
  onSuccess: () => void;
}

export const ListeningChallengeView: React.FC<ListeningChallengeViewProps> = ({
  items,
  voiceSettings,
  onSuccess,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<QAItem[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentItem = items[currentIndex] || items[0];

  const setupListeningRound = (idx: number) => {
    if (!items.length) return;
    const target = items[idx];
    
    // Choose 2 other distinct items
    const others = items.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5);
    const roundOptions = [target, ...others.slice(0, 2)].sort(() => Math.random() - 0.5);

    setOptions(roundOptions);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);

    // Auto-play audio
    playAudioPrompt(target);
  };

  const playAudioPrompt = (item: QAItem) => {
    setIsPlayingAudio(true);
    speechEngine.speak(item.a, {
      voiceType: 'kid',
      pitch: voiceSettings.kidPitch,
      rate: 0.9,
      lang: voiceSettings.bengaliAccentMode ? 'bn-BD' : 'en-US',
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      setupListeningRound(currentIndex);
    }
  }, [currentIndex, items]);

  const handleSelect = (chosen: QAItem) => {
    if (isAnswered) return;

    setSelectedOptionId(chosen.id);
    setIsAnswered(true);

    if (chosen.id === currentItem.id) {
      setIsCorrect(true);
      soundFX.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onSuccess();
    } else {
      setIsCorrect(false);
      soundFX.playError();
    }
  };

  const handleNext = () => {
    soundFX.playPop();
    const nextIdx = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIdx);
    setupListeningRound(nextIdx);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border-4 border-purple-200 text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce-slow">🎧</span>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-purple-800">Listening Challenge</h2>
            <p className="text-xs text-slate-500 font-semibold">Listen to the spoken audio and pick the matching card!</p>
          </div>
        </div>

        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-2xl">
          Challenge #{currentIndex + 1}
        </span>
      </div>

      {/* Big Audio Player Box */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 p-6 sm:p-8 rounded-3xl border-2 border-purple-200 shadow-inner mb-6 space-y-4">
        <button
          onClick={() => {
            soundFX.playPop();
            playAudioPrompt(currentItem);
          }}
          className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg shadow-purple-200 transition transform hover:scale-105 active:scale-95 border-4 border-white ${
            isPlayingAudio ? 'animate-pulse ring-8 ring-purple-200' : ''
          }`}
          title="Click to play sound again"
        >
          <Volume2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </button>

        <div>
          <p className="text-sm sm:text-base font-extrabold text-purple-900">
            {isPlayingAudio ? 'Speaking now... Listen carefully!' : 'Tap the speaker to hear the sentence!'}
          </p>
          <p className="text-xs text-purple-600 mt-1 font-semibold">
            Which sentence did the Bangladeshi kid say?
          </p>
        </div>

        {isAnswered && (
          <div className="p-3 bg-white/80 rounded-2xl border border-purple-200 text-xs sm:text-sm text-purple-900 font-bold animate-fade-in">
            🔊 Spoken: "{currentItem.a}"
          </div>
        )}
      </div>

      {/* Options Cards */}
      <div className="grid grid-cols-1 gap-3.5 mb-6 text-left">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isTarget = opt.id === currentItem.id;

          let cardStyle = "bg-slate-50 hover:bg-purple-50 text-slate-800 border-2 border-slate-200 hover:border-purple-300";

          if (isAnswered) {
            if (isTarget) {
              cardStyle = "bg-green-100 border-2 border-green-500 text-green-900 font-bold shadow-md scale-[1.02]";
            } else if (isSelected && !isTarget) {
              cardStyle = "bg-rose-100 border-2 border-rose-400 text-rose-900 line-through opacity-70";
            } else {
              cardStyle = "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl transition flex items-center gap-3.5 ${cardStyle}`}
            >
              <span className="text-3xl bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                {opt.emoji}
              </span>
              <div className="flex-1">
                <span className="text-[11px] font-extrabold uppercase text-purple-600 block">
                  Q. {opt.q}
                </span>
                <span className="text-sm sm:text-base font-bold">
                  A. {opt.a}
                </span>
              </div>
              {isAnswered && isTarget && <span className="text-xl">✅</span>}
              {isAnswered && isSelected && !isTarget && <span className="text-xl">❌</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next */}
      {isAnswered && (
        <div className="space-y-4 animate-fade-in">
          <p className={`text-base sm:text-lg font-black ${isCorrect ? 'text-green-600' : 'text-amber-700'}`}>
            {isCorrect ? '🎉 Great listening ears! You matched it right! 🌟' : '💪 Good try! Listen again and keep practicing!'}
          </p>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-black text-base shadow-lg transition active:scale-95"
          >
            <span>Next Listening Challenge</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
