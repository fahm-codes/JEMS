export interface QAItem {
  id: string;
  q: string;
  a: string;
  banglaQ: string;
  banglaA: string;
  emoji: string;
  category: 'routine' | 'school' | 'friends' | 'food' | 'hobbies' | 'general';
  hint?: string;
  isCustom?: boolean;
}

export type LearningMode = 'cards' | 'quiz' | 'scramble' | 'listening';

export interface VoiceSettings {
  kidPitch: number;      // e.g. 1.35
  teacherPitch: number;  // e.g. 1.0
  rate: number;          // e.g. 0.92
  preferredVoiceURI?: string;
  bengaliAccentMode: boolean;
}

export interface LearnerProgress {
  stars: number;
  streak: number;
  bestStreak: number;
  cardsPracticed: Record<string, number>; // id -> count
  quizCorrectTotal: number;
  quizAttemptTotal: number;
  earnedBadges: string[];
  favorites: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requiredStars: number;
}
