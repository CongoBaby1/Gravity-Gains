import { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

const EXERCISE_IMAGES: Record<string, any> = {
  'wall-sit': require('@/assets/exercises/wall-sit.png'),
  'plank': require('@/assets/exercises/plank.png'),
  'superman': require('@/assets/exercises/superman.png'),
  'push-up-hold': require('@/assets/exercises/push-up-hold.png'),
  'horse-stance': require('@/assets/exercises/horse-stance.png'),
  'cat-cow': require('@/assets/exercises/cat-cow.jpg'),
  'hip-mobility': require('@/assets/exercises/hip-mobility.jpg'),
  'shoulder-mobility': require('@/assets/exercises/shoulder-mobility.jpg'),
  'hamstring-reach': require('@/assets/exercises/hamstring-reach.jpg'),
  'butterfly-stretch': require('@/assets/exercises/butterfly-stretch.jpg'),
  'worlds-greatest-stretch': require('@/assets/exercises/worlds-greatest-stretch.jpg'),
};

function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  // Chrome hack: wake up synthesizer if it went idle
  window.speechSynthesis.resume();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) utterance.voice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
  utterance.onstart = () => console.log('[TTS]', text);
  utterance.onerror = (e) => console.warn('[TTS Error]', (e as any).error, (e as any).message);
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

interface ExercisePlan {
  id: string;
  name: string;
  emoji: string;
  sets: number;
  holdSeconds: number;
}

const PLANS: Record<string, ExercisePlan[]> = {
  'wall-sit': [{ id: 'wall-sit', name: 'Wall Sit', emoji: '', sets: 3, holdSeconds: 60 }],
  'plank': [{ id: 'plank', name: 'Dead-Stop Plank', emoji: '', sets: 3, holdSeconds: 45 }],
  'superman': [{ id: 'superman', name: 'Superman Hold', emoji: '', sets: 3, holdSeconds: 30 }],
  'push-up-hold': [{ id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '', sets: 3, holdSeconds: 30 }],
  'horse-stance': [{ id: 'horse-stance', name: 'Horse Stance', emoji: '', sets: 3, holdSeconds: 60 }],
  'cat-cow': [{ id: 'cat-cow', name: 'Back Mobility', emoji: '', sets: 2, holdSeconds: 60 }],
  'hip-mobility': [{ id: 'hip-mobility', name: 'Hip Mobility', emoji: '', sets: 2, holdSeconds: 60 }],
  'shoulder-mobility': [{ id: 'shoulder-mobility', name: 'Shoulder Mobility', emoji: '', sets: 2, holdSeconds: 60 }],
  'hamstring-reach': [{ id: 'hamstring-reach', name: 'Hamstring Reach', emoji: '', sets: 2, holdSeconds: 30 }],
  'butterfly-stretch': [{ id: 'butterfly-stretch', name: 'Butterfly Stretch', emoji: '', sets: 2, holdSeconds: 30 }],
  'worlds-greatest-stretch': [{ id: 'worlds-greatest-stretch', name: "World's Greatest Stretch", emoji: '', sets: 2, holdSeconds: 30 }],
};

const DEFAULT_PLAN: ExercisePlan[] = [
  { id: 'ex1', name: 'Exercise A', emoji: '', sets: 3, holdSeconds: 45 },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const exercises = PLANS[id ?? ''] ?? DEFAULT_PLAN;

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'running' | 'paused' | 'stopped' | 'summary'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [elapsed, setElapsed] = useState(0);
  const [records, setRecords] = useState<{ exercise: string; set: number; time: number }[]>([]);
  const [prFlash, setPrFlash] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [micReady, setMicReady] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request mic permission early so the browser popup doesn't interrupt the countdown
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicReady(true))
      .catch(() => setMicReady(false));
  }, []);

  const exercise = exercises[exIdx];
  const totalSets = exercise.sets;

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null; }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const startCountdown = () => {
    setPhase('countdown');
    setCountdown(5);
    // Speak intro, then start the synced 5-second interval after it finishes
    speak(`Get ready. ${exercise.name} in 5.`, () => {
      let remaining = 5;
      speak(String(remaining));
      cdRef.current = setInterval(() => {
        remaining -= 1;
        setCountdown((c) => {
          const next = c - 1;
          if (next <= 0) {
            clearInterval(cdRef.current!);
            cdRef.current = null;
            speak('Go!');
            beginHold();
            return 0;
          }
          speak(String(next));
          return next;
        });
      }, 1000);
    });
  };

  const beginHold = () => {
    setPhase('running');
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  };

  const pause = () => {
    clearTimers();
    setPhase('paused');
    speak('Paused.');
  };

  const resume = () => {
    setPhase('running');
    speak('Resume.');
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  };

  const stop = () => {
    clearTimers();
    setPhase('stopped');
    speak('Stopped.');
    const record = { exercise: exercise.name, set: setIdx + 1, time: elapsed };
    setRecords((prev) => [...prev, record]);
    if (elapsed >= exercise.holdSeconds) {
      setPrFlash(true);
      speak('Personal record!');
      setTimeout(() => setPrFlash(false), 2000);
    }
  };

  const next = () => {
    setPrFlash(false);
    if (setIdx + 1 < totalSets) {
      setSetIdx((s) => s + 1);
      setPhase('idle');
      setElapsed(0);
      setCountdown(5);
    } else if (exIdx + 1 < exercises.length) {
      setExIdx((e) => e + 1);
      setSetIdx(0);
      setPhase('idle');
      setElapsed(0);
      setCountdown(5);
    } else {
      setPhase('summary');
    }
  };

  const repeat = () => {
    setPhase('idle');
    setElapsed(0);
    setCountdown(5);
    setPrFlash(false);
  };

  // Voice command: listen for "stop" while timer is active
  const { listening } = useVoiceCommand({
    active: phase === 'running' || phase === 'countdown',
    onCommand: stop,
    transcript: (text) => setLastHeard(text),
  });

  if (phase === 'summary') {
    const totalTime = records.reduce((sum, r) => sum + r.time, 0);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}> Workout Complete!</Text>
          <Text style={styles.subtitle}>Total hold time: {formatTime(totalTime)}</Text>
          {records.map((r, i) => (
            <View key={i} style={styles.summaryCard}>
              <Text style={styles.summaryText}>{r.exercise} — Set {r.set}: {formatTime(r.time)}</Text>
            </View>
          ))}
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/programs')}>
            <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Text style={styles.ctaText}> Back to Programs</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{exercise.emoji}</Text>
        <Text style={styles.headerName}>{exercise.name}</Text>
        <Text style={styles.headerSets}>Set {setIdx + 1} of {totalSets}</Text>
        {(listening || lastHeard) && (
          <View style={styles.micRow}>
            {listening && <View style={styles.micDot} />}
            <Text style={styles.micText}>
              {listening ? ' Listening' : ''}
              {lastHeard ? `  ·  Heard: "${lastHeard}"` : ''}
            </Text>
          </View>
        )}
      </View>

      {EXERCISE_IMAGES[exercise.id] && (
        <Image source={EXERCISE_IMAGES[exercise.id]} style={styles.exerciseImage} resizeMode="contain" />
      )}

      <View style={styles.timerWrap}>
        <Text style={styles.timer}>
          {phase === 'countdown' ? String(countdown) : formatTime(elapsed)}
        </Text>
        {phase === 'countdown' && <Text style={styles.timerLabel}>Get ready…</Text>}
      </View>

      {prFlash && (
        <View style={styles.prBanner}>
          <Text style={styles.prText}> Personal Record!</Text>
        </View>
      )}

      <View style={styles.controls}>
        {phase === 'idle' && (
          <>
            <TouchableOpacity activeOpacity={0.8} onPress={startCountdown}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.success }]} >
                <Text style={styles.controlText}>▶ Start</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={stop}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.danger }]} >
                <Text style={styles.controlText}> Stop</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        {phase === 'idle' && <Text style={styles.stopCue}>SAY STOP TO END EXERCISE</Text>}

        {phase === 'countdown' && (
          <View style={[styles.controlBtn, { backgroundColor: Colors.darkElevated }]} >
            <Text style={styles.controlText}> {countdown}</Text>
          </View>
        )}

        {phase === 'running' && (
          <>
            <TouchableOpacity activeOpacity={0.8} onPress={pause}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.warning }]} >
                <Text style={styles.controlText}> Pause</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={stop}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.danger }]} >
                <Text style={styles.controlText}> Stop</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {phase === 'paused' && (
          <TouchableOpacity activeOpacity={0.8} onPress={resume}>
            <View style={[styles.controlBtn, { backgroundColor: Colors.success }]} >
              <Text style={styles.controlText}>▶ Resume</Text>
            </View>
          </TouchableOpacity>
        )}

        {phase === 'stopped' && (
          <>
            <TouchableOpacity activeOpacity={0.8} onPress={repeat}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.info }]} >
                <Text style={styles.controlText}> Repeat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={next}>
              <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.controlBtn}>
                <Text style={styles.controlText}> Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack, justifyContent: 'center' },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.lg },
  headerEmoji: { fontSize: FontSizes.hero },
  headerName: { color: Colors.textPrimary, fontSize: FontSizes['2xl'], fontWeight: '700', marginTop: Spacing.sm },
  headerSets: { color: Colors.textSecondary, fontSize: FontSizes.lg, marginTop: Spacing.xs },
  exerciseImage: {
    width: '100%',
    height: 180,
    marginBottom: Spacing.lg,
  },
  timerWrap: {
    alignSelf: 'center',
    backgroundColor: Colors.darkCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
    minWidth: 260,
    alignItems: 'center',
  },
  timer: { color: Colors.textPrimary, fontSize: FontSizes.hero, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  timerLabel: { color: Colors.textSecondary, fontSize: FontSizes.base, marginTop: Spacing.xs },
  prBanner: {
    alignSelf: 'center',
    backgroundColor: Colors.goldMuted,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  prText: { color: Colors.gold, fontSize: FontSizes.lg, fontWeight: '700' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg },
  controlBtn: {
    borderRadius: 14,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minWidth: 120,
    alignItems: 'center',
  },
  controlText: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSizes.lg },
  micRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.xs },
  micDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  micText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  title: { color: Colors.textPrimary, fontSize: FontSizes['3xl'], fontWeight: 'bold', textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.lg, textAlign: 'center', marginBottom: Spacing.lg },
  summaryCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryText: { color: Colors.textPrimary, fontSize: FontSizes.base },
  cta: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  ctaText: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSizes.lg },
  stopCue: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: FontSizes.sm,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
