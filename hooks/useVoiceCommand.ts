import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

type Phase = 'idle' | 'countdown' | 'running' | 'work' | 'rest' | 'paused' | 'stopped';

interface UseVoiceCommandOptions {
  active: boolean;
  onCommand: () => void;
}

export function useVoiceCommand({ active, onCommand }: UseVoiceCommandOptions) {
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const onCommandRef = useRef(onCommand);
  onCommandRef.current = onCommand;

  const start = useCallback(() => {
    if (Platform.OS !== 'web') return; // Web Speech API is web-only here
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => setListening(true);
    rec.onend = () => {
      setListening(false);
      // auto-restart if still active
      if (active) {
        setTimeout(() => start(), 300);
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setListening(false);
        return;
      }
      setListening(false);
      if (active) setTimeout(() => start(), 600);
    };
    rec.onresult = (e: any) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      const text = transcript.toLowerCase().trim();
      setLastTranscript(text);
      if (text.includes('stop') || text.includes('pause')) {
        onCommandRef.current();
        // restart after a short delay so the next utterance doesn't immediately trigger again
        try { rec.stop(); } catch {}
      }
    };

    recognitionRef.current = rec;
    try { rec.start(); } catch {}
  }, [active]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  useEffect(() => {
    if (active) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [active, start, stop]);

  return { listening, lastTranscript };
}
