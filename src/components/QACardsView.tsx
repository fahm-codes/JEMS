import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  Sparkles, 
  Languages, 
  Heart, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  Search,
  Filter,
  Flame,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QAItem, VoiceSettings } from '../types';
import { speechEngine, soundFX } from '../utils/audio';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';

interface QACardsViewProps {
  items: QAItem[];
  voiceSettings: VoiceSettings;
  favorites: string[];
  cardsPracticed: Record<string, number>;
  onPracticeCard: (cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
  onEarnStar: (count: number) => void;
}

export const QACardsView: React.FC<QACardsViewProps> = ({
  items,
  voiceSettings,
  favorites,
  cardsPracticed,
  onPracticeCard,
  onToggleFavorite,
  onEarnStar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBangla, setShowBangla] = useState<boolean>(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [activeSpeakerRole, setActiveSpeakerRole] = useState<'teacher' | 'kid' | null>(null);
  const [recordingCardId, setRecordingCardId] = useState<string | null>(null);
  const [voiceTestFeedback, setVoiceTestFeedback] = useState<{
    cardId: string;
    transcript: string;
    isMatch: boolean;
    accuracy: number;
  } | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Cards 🌟' },
    { id: 'routine', label: 'Daily Routine ⏰' },
    { id: 'school', label: 'School & Study 🎒' },
    { id: 'friends', label: 'Friends & Family 🤝' },
    { id: 'food', label: 'Food & Meals 🍛' },
    { id: 'hobbies', label: 'Hobbies & Play ⚽' },
    { id: 'favorites', label: 'My Favorites ❤️' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(item.id)) return false;
    } else if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inQ = item.q.toLowerCase().includes(q);
      const inA = item.a.toLowerCase().includes(q);
      const inBQ = item.banglaQ.toLowerCase().includes(q);
      const inBA = item.banglaA.toLowerCase().includes(q);
      return inQ || inA || inBQ || inBA;
    }

    return true;
  });

  const speakQuestion = (item: QAItem) => {
    setActiveSpeakingId(item.id);
    setActiveSpeakerRole('teacher');
    soundFX.playPop();

    speechEngine.speak(item.q, {
      voiceType: 'teacher',
      pitch: voiceSettings.teacherPitch,
      rate: voiceSettings.rate,
      onEnd: () => {
        setActiveSpeakingId(null);
        setActiveSpeakerRole(null);
      },
    });

    onPracticeCard(item.id);
  };

  const speakAnswer = (item: QAItem) => {
    setActiveSpeakingId(item.id);
    setActiveSpeakerRole('kid');
    soundFX.playPop();

    speechEngine.speak(item.a, {
      voiceType: 'kid',
      pitch: voiceSettings.kidPitch,
      rate: voiceSettings.rate,
      lang: voiceSettings.bengaliAccentMode ? 'bn-BD' : 'en-US',
      onEnd: () => {
        setActiveSpeakingId(null);
        setActiveSpeakerRole(null);
      },
    });

    onPracticeCard(item.id);
  };

  const playConversation = (item: QAItem) => {
    setActiveSpeakingId(item.id);
    setActiveSpeakerRole('teacher');
    soundFX.playPop();

    speechEngine.playDialogue(
      item.q,
      item.a,
      () => {
        setActiveSpeakingId(item.id);
        setActiveSpeakerRole('teacher');
      },
      () => {
        setActiveSpeakingId(item.id);
        setActiveSpeakerRole('kid');
      },
      () => {
        setActiveSpeakingId(null);
        setActiveSpeakerRole(null);
      }
    );

    onPracticeCard(item.id);
  };

  const handleStartMicPractice = (item: QAItem) => {
    if (!isSpeechRecognitionSupported()) {
      alert("Microphone recognition is not supported in this browser. Try Google Chrome or Microsoft Edge!");
      return;
    }

    soundFX.playPop();
    setRecordingCardId(item.id);
    setRecognitionError(null);
    setVoiceTestFeedback(null);

    const recognizer = createSpeechRecognizer(
      item.a,
      (res) => {
        setVoiceTestFeedback({
          cardId: item.id,
          ...res,
        });
        if (res.isMatch) {
          soundFX.playSuccess();
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
          });
          onEarnStar(1);
        } else {
          soundFX.playError();
        }
      },
      (err) => {
        setRecognitionError(err);
      },
      () => {
        setRecordingCardId(null);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch (e) {
        setRecordingCardId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Control Bar */}
      <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-md border-2 border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 font-medium transition"
          />
        </div>

        {/* Global Toggles */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => {
              soundFX.playPop();
              setShowBangla(!showBangla);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold border-2 transition ${
              showBangla
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Languages className="w-4 h-4 text-emerald-600" />
            <span>{showBangla ? 'Bangla Hints ON' : 'Bangla Hints OFF'}</span>
          </button>

          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-2xl">
            {filteredItems.length} {filteredItems.length === 1 ? 'Card' : 'Cards'}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundFX.playPop();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-2 ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border-4 border-dashed border-slate-200">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">No questions found</h3>
          <p className="text-sm text-slate-500">Try changing your search keywords or category filter!</p>
        </div>
      )}

      {/* Q&A Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredItems.map((item, index) => {
          const isPracticed = (cardsPracticed[item.id] || 0) > 0;
          const practiceCount = cardsPracticed[item.id] || 0;
          const isFavorite = favorites.includes(item.id);
          const isCurrentActive = activeSpeakingId === item.id;
          const isRecording = recordingCardId === item.id;
          const cardFeedback = voiceTestFeedback?.cardId === item.id ? voiceTestFeedback : null;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 shadow-lg border-4 transition-all duration-200 relative overflow-hidden ${
                isCurrentActive
                  ? 'border-indigo-400 ring-4 ring-indigo-100 shadow-2xl scale-[1.01]'
                  : 'border-slate-100 hover:border-amber-200 hover:shadow-xl'
              }`}
            >
              {/* Top Card Bar: Number, Emoji, Favorite, Practice count */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl bg-indigo-50 border border-indigo-100 p-2 sm:p-2.5 rounded-2xl shadow-inner select-none">
                    {item.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                        Question #{index + 1}
                      </span>
                      {practiceCount > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-amber-600" />
                          Practiced {practiceCount}x
                        </span>
                      )}
                    </div>
                    {item.hint && (
                      <p className="text-[11px] text-slate-400 font-medium">
                        💡 {item.hint}
                      </p>
                    )}
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => {
                    soundFX.playPop();
                    onToggleFavorite(item.id);
                  }}
                  className={`p-2 rounded-2xl border transition ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Question & Answer Sections */}
              <div className="space-y-3.5 my-3">
                {/* Question Row */}
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrentActive && activeSpeakerRole === 'teacher'
                    ? 'bg-blue-100/70 border-blue-400 shadow-sm'
                    : 'bg-blue-50/50 border-blue-100'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        👩‍🏫 Teacher Asks
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                        Q. {item.q}
                      </h3>
                      {showBangla && item.banglaQ && (
                        <p className="text-xs sm:text-sm font-semibold text-slate-600">
                          বাংলা: {item.banglaQ}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => speakQuestion(item)}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 flex-shrink-0 active:scale-95"
                      title="Listen to Teacher"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Teacher</span>
                    </button>
                  </div>
                </div>

                {/* Answer Row (Kid Voice Highlight) */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isCurrentActive && activeSpeakerRole === 'kid'
                    ? 'bg-emerald-100/80 border-emerald-400 shadow-md'
                    : 'bg-emerald-50/60 border-emerald-200'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                        🧒 Kid Answer (Bangladeshi Child Voice)
                      </span>
                      <p className="text-lg sm:text-xl font-bold text-emerald-950">
                        A. {item.a}
                      </p>
                      {showBangla && item.banglaA && (
                        <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                          বাংলা: {item.banglaA}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => speakAnswer(item)}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 flex-shrink-0 active:scale-95"
                      title="Listen to Kid Voice"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Kid Voice</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                {/* Dialogue Duo Player */}
                <button
                  onClick={() => playConversation(item)}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-600" />
                  <span>Play Full Dialogue (Q & A)</span>
                </button>

                {/* Mic Pronunciation Practice */}
                <button
                  onClick={() => handleStartMicPractice(item)}
                  disabled={isRecording}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 active:scale-95 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                  title="Speak into your microphone to practice pronunciation"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? 'Listening... Speak Now! 🎙️' : 'Practice Saying This'}</span>
                </button>
              </div>

              {/* Microphone Evaluation Feedback Banner */}
              {cardFeedback && (
                <div className={`mt-3 p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 border ${
                  cardFeedback.isMatch
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}>
                  <div>
                    <span>{cardFeedback.isMatch ? '🎉 Super Star! You spoke clearly!' : '👍 Good try! Keep practicing!'}</span>
                    <p className="text-xs font-normal mt-0.5">
                      You said: <span className="font-semibold italic">"{cardFeedback.transcript}"</span> (Match: {cardFeedback.accuracy}%)
                    </p>
                  </div>
                  {cardFeedback.isMatch && (
                    <span className="text-lg">⭐ +1</span>
                  )}
                </div>
              )}

              {recognitionError && recordingCardId === item.id && (
                <p className="text-xs text-rose-600 font-semibold mt-2">
                  ⚠️ {recognitionError}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
