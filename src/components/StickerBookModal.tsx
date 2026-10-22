import React from 'react';
import { X, Award, Star, CheckCircle, Lock, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BADGES_LIST } from '../data/qaData';
import { LearnerProgress } from '../types';
import { soundFX } from '../utils/audio';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: LearnerProgress;
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  if (!isOpen) return null;

  const handleCelebrate = () => {
    soundFX.playStar();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-3xl flex items-center justify-center text-3xl shadow-lg border-2 border-white">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-800">Kid's Sticker & Badge Book</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Collect stars by practicing cards, taking quizzes, and building sentences!
          </p>

          {/* Star Summary Card */}
          <div className="mt-4 inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-300 px-5 py-2 rounded-2xl shadow-sm">
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Total Stars</span>
              <span className="text-xl font-black text-amber-900">{progress.stars} Stars Earned</span>
            </div>
            <button
              onClick={handleCelebrate}
              className="ml-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition active:scale-95"
            >
              Celebrate 🎉
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = progress.stars >= badge.requiredStars;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50/60 border-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  isUnlocked ? 'bg-white border-amber-200 shadow-sm' : 'bg-slate-200 border-slate-300'
                }`}>
                  {isUnlocked ? badge.emoji : '🔒'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-800">{badge.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                  <div className="mt-2 text-[11px] font-bold">
                    {isUnlocked ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Unlocked!
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Needs {badge.requiredStars} stars
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold px-3 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Star Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow transition active:scale-95 text-sm"
          >
            Keep Learning!
          </button>
        </div>
      </div>
    </div>
  );
};
