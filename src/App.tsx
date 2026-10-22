/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QAItem, LearningMode, VoiceSettings, LearnerProgress } from './types';
import { INITIAL_QA_DATA, BADGES_LIST } from './data/qaData';
import { Header } from './components/Header';
import { QACardsView } from './components/QACardsView';
import { QuizView } from './components/QuizView';
import { SentenceBuilderView } from './components/SentenceBuilderView';
import { ListeningChallengeView } from './components/ListeningChallengeView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { StickerBookModal } from './components/StickerBookModal';
import { AddQAModal } from './components/AddQAModal';
import { soundFX, speechEngine } from './utils/audio';

const STORAGE_KEYS = {
  QA_DATA: 'junior_english_qa_data_v1',
  VOICE_SETTINGS: 'junior_english_voice_settings_v1',
  PROGRESS: 'junior_english_progress_v1',
};

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  kidPitch: 1.35,
  teacherPitch: 1.05,
  rate: 0.92,
  bengaliAccentMode: false,
};

const DEFAULT_PROGRESS: LearnerProgress = {
  stars: 3, // starter stars for motivation!
  streak: 0,
  bestStreak: 0,
  cardsPracticed: {},
  quizCorrectTotal: 0,
  quizAttemptTotal: 0,
  earnedBadges: ['first-step'],
  favorites: [],
};

export default function App() {
  const [qaItems, setQaItems] = useState<QAItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QA_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_QA_DATA;
  });

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOICE_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_VOICE_SETTINGS;
  });

  const [progress, setProgress] = useState<LearnerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  const [currentMode, setCurrentMode] = useState<LearningMode>('cards');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [isAddQAModalOpen, setIsAddQAModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QA_DATA, JSON.stringify(qaItems));
    } catch {
      // ignore
    }
  }, [qaItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_SETTINGS, JSON.stringify(voiceSettings));
    } catch {
      // ignore
    }
  }, [voiceSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Check badges unlock
  const checkBadgeUnlocks = (newStars: number) => {
    const newlyUnlocked: string[] = [];
    BADGES_LIST.forEach((badge) => {
      if (newStars >= badge.requiredStars && !progress.earnedBadges.includes(badge.id)) {
        newlyUnlocked.push(badge.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      soundFX.playStar();
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
      });
      return [...progress.earnedBadges, ...newlyUnlocked];
    }
    return progress.earnedBadges;
  };

  const handleEarnStars = (count: number) => {
    setProgress((prev) => {
      const newStars = prev.stars + count;
      const updatedBadges = checkBadgeUnlocks(newStars);
      return {
        ...prev,
        stars: newStars,
        earnedBadges: updatedBadges,
      };
    });
  };

  const handlePracticeCard = (cardId: string) => {
    setProgress((prev) => {
      const currentCount = prev.cardsPracticed[cardId] || 0;
      const newCount = currentCount + 1;
      const newStars = prev.stars + (currentCount === 0 ? 1 : 0); // reward first practice
      return {
        ...prev,
        stars: newStars,
        cardsPracticed: {
          ...prev.cardsPracticed,
          [cardId]: newCount,
        },
      };
    });
  };

  const handleToggleFavorite = (cardId: string) => {
    setProgress((prev) => {
      const exists = prev.favorites.includes(cardId);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((id) => id !== cardId)
          : [...prev.favorites, cardId],
      };
    });
  };

  const handleQuizResult = (isCorrect: boolean) => {
    setProgress((prev) => {
      const newAttempt = prev.quizAttemptTotal + 1;
      const newCorrect = isCorrect ? prev.quizCorrectTotal + 1 : prev.quizCorrectTotal;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      const earned = isCorrect ? 2 : 0;
      const newStars = prev.stars + earned;
      const updatedBadges = checkBadgeUnlocks(newStars);

      return {
        ...prev,
        stars: newStars,
        streak: newStreak,
        bestStreak,
        quizAttemptTotal: newAttempt,
        quizCorrectTotal: newCorrect,
        earnedBadges: updatedBadges,
      };
    });
  };

  const handleAddQA = (newItem: QAItem) => {
    setQaItems((prev) => [newItem, ...prev]);
    handleEarnStars(2); // reward for creating a card!
  };

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col justify-between">
      <div>
        {/* Main Header with Mascot, Badges, Tabs */}
        <Header
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          progress={progress}
          onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
          onOpenStickerBook={() => setIsStickerModalOpen(true)}
          onOpenAddQA={() => setIsAddQAModalOpen(true)}
        />

        {/* Learning Mode Views */}
        <main className="transition-all duration-300">
          {currentMode === 'cards' && (
            <QACardsView
              items={qaItems}
              voiceSettings={voiceSettings}
              favorites={progress.favorites}
              cardsPracticed={progress.cardsPracticed}
              onPracticeCard={handlePracticeCard}
              onToggleFavorite={handleToggleFavorite}
              onEarnStar={handleEarnStars}
            />
          )}

          {currentMode === 'quiz' && (
            <QuizView
              items={qaItems}
              voiceSettings={voiceSettings}
              streak={progress.streak}
              onAnswerResult={handleQuizResult}
            />
          )}

          {currentMode === 'scramble' && (
            <SentenceBuilderView
              items={qaItems}
              voiceSettings={voiceSettings}
              onSuccess={() => handleEarnStars(2)}
            />
          )}

          {currentMode === 'listening' && (
            <ListeningChallengeView
              items={qaItems}
              voiceSettings={voiceSettings}
              onSuccess={() => handleEarnStars(2)}
            />
          )}
        </main>
      </div>

      {/* Footer / Info */}
      <footer className="mt-12 text-center text-xs text-slate-500 font-semibold space-y-2 py-6 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 flex-wrap text-slate-600">
          <span>🌟 Junior English Q&A Masterbook</span>
          <span>•</span>
          <span>Designed with Bangladeshi Kids Voice Accents & Joyful Learning</span>
          <span>•</span>
          <button
            onClick={() => {
              speechEngine.stop();
              soundFX.playPop();
            }}
            className="text-indigo-600 hover:text-indigo-800 underline font-bold"
          >
            Stop Audio
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          Tip: Tap any card to hear pronunciation. Practice daily for fluent spoken English! 🇧🇩 🇬🇧 🇺🇸
        </p>
      </footer>

      {/* Modals */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        settings={voiceSettings}
        onSave={setVoiceSettings}
      />

      <StickerBookModal
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        progress={progress}
      />

      <AddQAModal
        isOpen={isAddQAModalOpen}
        onClose={() => setIsAddQAModalOpen(false)}
        onAdd={handleAddQA}
      />
    </div>
  );
}
