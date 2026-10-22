// Speech Recognition helper for Kid's Pronunciation Practice

export interface SpeechRecognitionResultState {
  transcript: string;
  isMatch: boolean;
  accuracy: number;
}

// Window typing for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function calculateSimilarity(textA: string, textB: string): number {
  const cleanA = textA.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const cleanB = textB.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  if (cleanA === cleanB) return 100;
  if (!cleanA || !cleanB) return 0;

  const wordsA = cleanA.split(/\s+/);
  const wordsB = cleanB.split(/\s+/);

  let matches = 0;
  wordsA.forEach(w => {
    if (wordsB.includes(w)) {
      matches++;
    }
  });

  const ratio = (matches / Math.max(wordsA.length, wordsB.length)) * 100;
  return Math.round(ratio);
}

export function createSpeechRecognizer(
  targetPhrase: string,
  onResult: (res: SpeechRecognitionResultState) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  const win = window as unknown as IWindow;
  const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRec) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRec();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    const accuracy = calculateSimilarity(transcript, targetPhrase);
    onResult({
      transcript,
      isMatch: accuracy >= 60,
      accuracy
    });
  };

  recognition.onerror = (event: any) => {
    let msg = 'Could not catch voice. Please try again!';
    if (event.error === 'not-allowed') {
      msg = 'Microphone permission was denied. Please allow microphone in browser.';
    }
    onError(msg);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
