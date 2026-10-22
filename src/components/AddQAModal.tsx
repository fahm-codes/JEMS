import React, { useState } from 'react';
import { X, Plus, Sparkles, Smile } from 'lucide-react';
import { QAItem } from '../types';
import { soundFX } from '../utils/audio';

interface AddQAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: QAItem) => void;
}

const EMOJI_OPTIONS = ['🌟', '👦', '👧', '🎨', '🚀', '🐱', '🐶', '🍎', '⚽', '🎒', '📚', '🌻', '🚲', '🍦', '🏖️'];

export const AddQAModal: React.FC<AddQAModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [banglaQ, setBanglaQ] = useState('');
  const [banglaA, setBanglaA] = useState('');
  const [category, setCategory] = useState<QAItem['category']>('routine');
  const [emoji, setEmoji] = useState('🌟');
  const [hint, setHint] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    soundFX.playPop();
    const newItem: QAItem = {
      id: `custom-${Date.now()}`,
      q: question.trim(),
      a: answer.trim(),
      banglaQ: banglaQ.trim(),
      banglaA: banglaA.trim(),
      category,
      emoji,
      hint: hint.trim() || undefined,
      isCustom: true,
    };

    onAdd(newItem);
    soundFX.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-emerald-300 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
            ➕
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Add New Q&A Card</h3>
            <p className="text-xs text-slate-500 font-semibold">Custom English conversation card for class or home</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question in English */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              English Question (Teacher Asks) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Where do you live?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Answer in English */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              English Answer (Kid Replies) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Well, I live in Dhaka, Bangladesh."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Bangla Question & Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Bangla Question (Optional)
              </label>
              <input
                type="text"
                placeholder="তুমি কোথায় বাস করো?"
                value={banglaQ}
                onChange={(e) => setBanglaQ(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Bangla Answer (Optional)
              </label>
              <input
                type="text"
                placeholder="আমি বাংলাদেশে বাস করি।"
                value={banglaA}
                onChange={(e) => setBanglaA(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Emoji & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QAItem['category'])}
                className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="routine">Daily Routine ⏰</option>
                <option value="school">School & Study 🎒</option>
                <option value="friends">Friends & Family 🤝</option>
                <option value="food">Food & Meals 🍛</option>
                <option value="hobbies">Hobbies & Play ⚽</option>
                <option value="general">General English 🌟</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Choose Emoji Icon
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition flex-shrink-0 border ${
                      emoji === em ? 'bg-amber-100 border-amber-400 scale-110 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hint */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Helpful Learning Hint (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Say city names with a capital letter!"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition active:scale-95"
            >
              Add Card ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
