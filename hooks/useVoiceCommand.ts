import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

interface UseVoiceCommandOptions {
  active: boolean;
  onCommand: () => void;
  transcript?: (text: string) => void; // optional debug callback
}

export function useVoiceCommand({ active, onCommand, transcript }: UseVoiceCommandOptions) {
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const activeRef = useRef(active);
  activeRef.current = active;
  const recognitionRef = useRef<any>(null);
  const onCommandRef = useRef(onCommand);
  onCommandRef.current = onCommand;
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;

  const start = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('[Voice] SpeechRecognition not available');
      return;
    }

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
      // auto-restart only if still active
      if (activeRef.current) {
        setTimeout(() => {
          if (activeRef.current) {
            start();
          }
        }, 300);
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        console.warn('[Voice] Mic permission denied');
        setListening(false);
        return;
      }
      if (e.error === 'aborted') {
        setListening(false);
        return;
      }
      console.warn('[Voice] Recognition error:', e.error);
      setListening(false);
      if (activeRef.current) {
        setTimeout(() => {
          if (activeRef.current) start();
        }, 600);
      }
    };
    rec.onresult = (e: any) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      const text = transcript.toLowerCase().trim();
      setLastTranscript(text);
      if (transcriptRef.current) transcriptRef.current(text);
      if (text.includes('stop') || text.includes('pause')) {
        onCommandRef.current();
        try { rec.stop(); } catch {}
      }
    };

    recognitionRef.current = rec;
    try { rec.start(); } catch (err) {
      console.warn('[Voice] Failed to start recognition:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
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
      stopListening();
    }
    return () => stopListening();
  }, [active, start, stopListening]);

  return { listening, lastTranscript };
}
