import React, { useState } from 'react';
import { X, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { VoiceSettings } from '../types';
import { speechEngine, soundFX } from '../utils/audio';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSave: (newSettings: VoiceSettings) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<VoiceSettings>(settings);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  if (!isOpen) return null;

  const handleTestKid = () => {
    setIsPlayingTest(true);
    speechEngine.speak("Hello teacher! Well, I play in the afternoon!", {
      voiceType: 'kid',
      pitch: localSettings.kidPitch,
      rate: localSettings.rate,
      lang: localSettings.bengaliAccentMode ? 'bn-BD' : 'en-US',
      onEnd: () => setIsPlayingTest(false),
    });
  };

  const handleTestTeacher = () => {
    setIsPlayingTest(true);
    speechEngine.speak("Good morning young learner! When do you go to school?", {
      voiceType: 'teacher',
      pitch: localSettings.teacherPitch,
      rate: 0.95,
      lang: 'en-US',
      onEnd: () => setIsPlayingTest(false),
    });
  };

  const handleSave = () => {
    soundFX.playPop();
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
            🎙️
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Voice & Speech Studio</h3>
            <p className="text-xs text-slate-500">Fine-tune the Bangladeshi Kid & Teacher Voice</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Kid Voice Pitch Slider */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                🧒 Kid Voice Pitch (Tone)
              </span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {localSettings.kidPitch.toFixed(2)}x
              </span>
            </div>
            <p className="text-xs text-emerald-700 mb-2">Higher pitch creates an authentic cheerful child voice.</p>
            <input
              type="range"
              min="0.9"
              max="1.7"
              step="0.05"
              value={localSettings.kidPitch}
              onChange={(e) => setLocalSettings({ ...localSettings, kidPitch: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-emerald-600 font-semibold mt-1">
              <span>Standard (1.0x)</span>
              <span>Cute Kid (1.35x)</span>
              <span>Cartoon High (1.7x)</span>
            </div>
          </div>

          {/* Speech Rate (Speed) Slider */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                ⏱️ Speaking Speed (Tempo)
              </span>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {localSettings.rate.toFixed(2)}x
              </span>
            </div>
            <p className="text-xs text-blue-700 mb-2">Gentle speed helps young beginners catch every syllable.</p>
            <input
              type="range"
              min="0.75"
              max="1.2"
              step="0.05"
              value={localSettings.rate}
              onChange={(e) => setLocalSettings({ ...localSettings, rate: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-blue-600 font-semibold mt-1">
              <span>Slow & Clear (0.75x)</span>
              <span>Gentle (0.92x)</span>
              <span>Normal (1.0x)</span>
            </div>
          </div>

          {/* Teacher Pitch */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                👩‍🏫 Teacher Question Pitch
              </span>
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                {localSettings.teacherPitch.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={localSettings.teacherPitch}
              onChange={(e) => setLocalSettings({ ...localSettings, teacherPitch: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Test Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleTestKid}
              disabled={isPlayingTest}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>Test Kid Voice</span>
            </button>
            <button
              onClick={handleTestTeacher}
              disabled={isPlayingTest}
              className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>Test Teacher Voice</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setLocalSettings({
                kidPitch: 1.35,
                teacherPitch: 1.05,
                rate: 0.92,
                bengaliAccentMode: false,
              });
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg transition active:scale-95"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
