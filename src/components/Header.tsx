import React from 'react';
import { Sparkles, Trophy, Settings2, PlusCircle, Volume2, Flame, Award } from 'lucide-react';
import { LearningMode, LearnerProgress } from '../types';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  currentMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  progress: LearnerProgress;
  onOpenVoiceSettings: () => void;
  onOpenStickerBook: () => void;
  onOpenAddQA: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  progress,
  onOpenVoiceSettings,
  onOpenStickerBook,
  onOpenAddQA,
}) => {
  const handleModeClick = (mode: LearningMode) => {
    soundFX.playPop();
    onSelectMode(mode);
  };

  return (
    <header className="mb-6 bg-white/90 backdrop-blur-md p-5 sm:p-7 rounded-3xl shadow-xl border-4 border-amber-300 relative overflow-hidden">
      {/* Decorative background clouds / stars */}
      <div className="absolute top-2 left-6 text-2xl select-none opacity-40">☁️</div>
      <div className="absolute top-3 right-10 text-xl select-none opacity-40">✨</div>
      <div className="absolute bottom-2 left-1/4 text-xl select-none opacity-30">🎈</div>

      {/* Top Bar with Mascot & Score Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        {/* Mascot & Title */}
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400 p-1 shadow-md flex-shrink-0 animate-bounce-slow">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              🧒
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs tracking-wider uppercase mb-1 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              Bangladesh Junior English Edition
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Junior English Q&A Masterbook
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Fun conversational Q&A with Bangladeshi Kids Voice, Pronunciation & Quizzes!
            </p>
          </div>
        </div>

        {/* Quick Progress Hub */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Star Counter */}
          <button
            onClick={() => {
              soundFX.playStar();
              onOpenStickerBook();
            }}
            title="View Rewards & Sticker Book"
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-800 px-3.5 py-1.5 rounded-2xl font-bold text-sm shadow-sm transition active:scale-95"
          >
            <span className="text-xl">⭐</span>
            <span className="text-base font-extrabold text-amber-700">{progress.stars}</span>
            <span className="text-xs text-amber-600 font-semibold hidden sm:inline">Stars</span>
          </button>

          {/* Streak Counter */}
          <div 
            title={`Current Streak: ${progress.streak} (Best: ${progress.bestStreak})`}
            className="flex items-center gap-1 bg-rose-50 border-2 border-rose-200 text-rose-700 px-3 py-1.5 rounded-2xl font-bold text-sm shadow-sm"
          >
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-base font-extrabold">{progress.streak}</span>
            <span className="text-xs text-rose-500 font-semibold hidden sm:inline">Streak</span>
          </div>

          {/* Sticker Book button */}
          <button
            onClick={() => {
              soundFX.playPop();
              onOpenStickerBook();
            }}
            className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 text-purple-700 px-3 py-1.5 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>Badges</span>
            {progress.earnedBadges.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                {progress.earnedBadges.length}
              </span>
            )}
          </button>

          {/* Settings & Add buttons */}
          <button
            onClick={() => {
              soundFX.playPop();
              onOpenVoiceSettings();
            }}
            title="Adjust Kid & Teacher Voice"
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 transition active:scale-95"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playPop();
              onOpenAddQA();
            }}
            title="Add Custom Question"
            className="p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-300 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2 border-t border-slate-100">
        <button
          onClick={() => handleModeClick('cards')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all transform duration-150 ${
            currentMode === 'cards'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105 border-2 border-indigo-700'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-100'
          }`}
        >
          <span>📖</span>
          <span>Q&A Cards</span>
        </button>

        <button
          onClick={() => handleModeClick('quiz')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all transform duration-150 ${
            currentMode === 'quiz'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 scale-105 border-2 border-amber-600'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-100'
          }`}
        >
          <span>🎮</span>
          <span>Fun Quiz</span>
        </button>

        <button
          onClick={() => handleModeClick('scramble')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all transform duration-150 ${
            currentMode === 'scramble'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105 border-2 border-emerald-700'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-100'
          }`}
        >
          <span>🧩</span>
          <span>Word Builder</span>
        </button>

        <button
          onClick={() => handleModeClick('listening')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all transform duration-150 ${
            currentMode === 'listening'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105 border-2 border-purple-700'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-2 border-purple-100'
          }`}
        >
          <span>🎧</span>
          <span>Listen & Pick</span>
        </button>
      </div>
    </header>
  );
};
