import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

type Command = 'start' | 'stop' | 'pause' | 'resume' | 'nextExercise'
  | 'skipExercise' | 'repeatInstructions' | 'endWorkout';

interface UseVoiceCommandOptions {
  active: boolean;
  onCommand: (cmd: Command) => void;
  transcript?: (text: string) => void;
}

const STOP_PATTERNS = ['stop', 'pause', 'hold'];
const START_PATTERNS = ['start', 'go', "let's go", 'begin'];
const RESUME_PATTERNS = ['resume', 'continue', 'play'];
const NEXT_PATTERNS = ['next exercise', 'next', 'skip set'];
const SKIP_PATTERNS = ['skip exercise', 'skip', 'pass'];
const REPEAT_PATTERNS = ['repeat', 'instructions', 'what do i do', 'how'];
const END_PATTERNS = ['end workout', 'stop workout', 'quit', 'finished', 'done'];

function matchCommand(text: string): Command | null {
  const t = text.toLowerCase();
  if (STOP_PATTERNS.some((p) => t.includes(p))) return 'stop';
  if (START_PATTERNS.some((p) => t.includes(p))) return 'start';
  if (RESUME_PATTERNS.some((p) => t.includes(p))) return 'resume';
  if (NEXT_PATTERNS.some((p) => t.includes(p))) return 'nextExercise';
  if (SKIP_PATTERNS.some((p) => t.includes(p))) return 'skipExercise';
  if (REPEAT_PATTERNS.some((p) => t.includes(p))) return 'repeatInstructions';
  if (END_PATTERNS.some((p) => t.includes(p))) return 'endWorkout';
  return null;
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

  const start = useCallback(function () {
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

    rec.onstart = function () { setListening(true); };
    rec.onend = function () {
      setListening(false);
      if (activeRef.current) {
        setTimeout(function () {
          if (activeRef.current) start();
        }, 300);
      }
    };
    rec.onerror = function (e: any) {
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
        setTimeout(function () {
          if (activeRef.current) start();
        }, 600);
      }
    };
    rec.onresult = function (e: any) {
      let transcriptText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcriptText += e.results[i][0].transcript;
      }
      const text = transcriptText.toLowerCase().trim();
      setLastTranscript(text);
      if (transcriptRef.current) transcriptRef.current(text);
      const cmd = matchCommand(text);
      if (cmd) {
        onCommandRef.current(cmd);
        try { rec.stop(); } catch {}
      }
    };

    recognitionRef.current = rec;
    try { rec.start(); } catch (err) {
      console.warn('[Voice] Failed to start recognition:', err);
    }
  }, []);

  const stopListening = useCallback(function () {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  useEffect(function () {
    if (active) {
      start();
    } else {
      stopListening();
    }
    return function () { stopListening(); };
  }, [active, start, stopListening]);

  return { listening, lastTranscript };
}
