import { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

interface ExercisePlan {
  id: string;
  name: string;
  emoji: string;
  sets: number;
  holdSeconds: number;
}

const PLANS: Record<string, ExercisePlan[]> = {
  'wall-sit': [{ id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 3, holdSeconds: 60 }],
  'plank': [{ id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 3, holdSeconds: 45 }],
  'superman': [{ id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 3, holdSeconds: 30 }],
  'push-up-hold': [{ id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '💪', sets: 3, holdSeconds: 30 }],
  'horse-stance': [{ id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 3, holdSeconds: 60 }],
  'air-squat': [{ id: 'air-squat', name: 'Air Squat', emoji: '🦵', sets: 3, holdSeconds: 60 }],
  'lunge-walk': [{ id: 'lunge-walk', name: 'Lunge Walk', emoji: '🚶', sets: 3, holdSeconds: 60 }],
  'hollow-body': [{ id: 'hollow-body', name: 'Hollow Body Hold', emoji: '🍩', sets: 3, holdSeconds: 30 }],
  'pull-up': [{ id: 'pull-up', name: 'Pull-Up', emoji: '🤸', sets: 3, holdSeconds: 30 }],
  'inverted-row': [{ id: 'inverted-row', name: 'Inverted Row', emoji: '📐', sets: 3, holdSeconds: 45 }],
  'glute-bridge': [{ id: 'glute-bridge', name: 'Glute Bridge', emoji: '🍑', sets: 3, holdSeconds: 45 }],
  'single-leg-rdl': [{ id: 'single-leg-rdl', name: 'Single-Leg RDL', emoji: '🦵', sets: 3, holdSeconds: 30 }],
  '90-hip': [{ id: '90-hip', name: '90/90 Hip Switch', emoji: '🔄', sets: 3, holdSeconds: 30 }],
  'cat-cow': [{ id: 'cat-cow', name: 'Cat-Cow', emoji: '🐈', sets: 2, holdSeconds: 60 }],
  'deep-squat': [{ id: 'deep-squat', name: 'Deep Squat Hold', emoji: '🪑', sets: 3, holdSeconds: 45 }],
  'morning': [
    { id: 'cat-cow', name: 'Cat-Cow', emoji: '🐈', sets: 2, holdSeconds: 60 },
    { id: '90-hip', name: '90/90 Hip Switch', emoji: '🦵', sets: 2, holdSeconds: 60 },
    { id: 'deep-squat', name: 'Deep Squat Hold', emoji: '🪑', sets: 2, holdSeconds: 45 },
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 2, holdSeconds: 45 },
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 2, holdSeconds: 30 },
    { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 2, holdSeconds: 45 },
  ] as any as ExercisePlan[],
  'hip': [
    { id: 'deep-squat', name: 'Deep Squat Hold', emoji: '🪑', sets: 3, holdSeconds: 60 },
    { id: '90-hip', name: '90/90 Hip Switch', emoji: '🦵', sets: 3, holdSeconds: 60 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 2, holdSeconds: 60 },
    { id: 'cat-cow', name: 'Cat-Cow', emoji: '🐈', sets: 2, holdSeconds: 60 },
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 2, holdSeconds: 45 },
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 2, holdSeconds: 30 },
    { id: 'glute-bridge', name: 'Glute Bridge Hold', emoji: '🍑', sets: 2, holdSeconds: 45 },
    { id: 'single-leg-rdl', name: 'Single-Leg RDL', emoji: '🦵', sets: 2, holdSeconds: 30 },
  ] as any as ExercisePlan[],
  'shoulder': [
    { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '💪', sets: 3, holdSeconds: 30 },
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 3, holdSeconds: 45 },
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 3, holdSeconds: 30 },
    { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 2, holdSeconds: 45 },
    { id: 'cat-cow', name: 'Cat-Cow', emoji: '🐈', sets: 2, holdSeconds: 60 },
    { id: 'deep-squat', name: 'Deep Squat Hold', emoji: '🪑', sets: 2, holdSeconds: 45 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 2, holdSeconds: 60 },
  ] as any as ExercisePlan[],
  'back': [
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 3, holdSeconds: 30 },
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 3, holdSeconds: 45 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 2, holdSeconds: 60 },
    { id: 'cat-cow', name: 'Cat-Cow', emoji: '🐈', sets: 3, holdSeconds: 60 },
    { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 2, holdSeconds: 45 },
    { id: 'glute-bridge', name: 'Glute Bridge Hold', emoji: '🍑', sets: 3, holdSeconds: 45 },
  ] as any as ExercisePlan[],
  'recovery': [
    { id: 'cat-cow', name: 'Cat-Cow', emoji: '🐈', sets: 2, holdSeconds: 60 },
    { id: 'deep-squat', name: 'Deep Squat Hold', emoji: '🪑', sets: 2, holdSeconds: 45 },
    { id: '90-hip', name: '90/90 Hip Switch', emoji: '🦵', sets: 2, holdSeconds: 45 },
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 2, holdSeconds: 30 },
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 2, holdSeconds: 30 },
    { id: 'glute-bridge', name: 'Glute Bridge Hold', emoji: '🍑', sets: 2, holdSeconds: 45 },
    { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 2, holdSeconds: 30 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 2, holdSeconds: 45 },
    { id: 'single-leg-rdl', name: 'Single-Leg RDL Hold', emoji: '🦵', sets: 2, holdSeconds: 30 },
    { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '💪', sets: 2, holdSeconds: 20 },
  ] as any as ExercisePlan[],
  'core-crusher': [
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 4, holdSeconds: 60 },
    { id: 'hollow-body', name: 'Hollow Body Hold', emoji: '🍩', sets: 3, holdSeconds: 45 },
    { id: 'push-up-hold', name: 'Push-Up Hold', emoji: '💪', sets: 3, holdSeconds: 30 },
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 3, holdSeconds: 30 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 3, holdSeconds: 60 },
  ] as any as ExercisePlan[],
  'posterior-power': [
    { id: 'superman', name: 'Superman Hold', emoji: '🦸', sets: 4, holdSeconds: 45 },
    { id: 'glute-bridge', name: 'Glute Bridge Hold', emoji: '🍑', sets: 3, holdSeconds: 60 },
    { id: 'single-leg-rdl', name: 'Single-Leg RDL', emoji: '🦵', sets: 3, holdSeconds: 30 },
    { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 3, holdSeconds: 60 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 2, holdSeconds: 90 },
  ] as any as ExercisePlan[],
  'push-pull-ladder': [
    { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '💪', sets: 4, holdSeconds: 30 },
    { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', sets: 4, holdSeconds: 45 },
    { id: 'pull-up', name: 'Pull-Up Hold', emoji: '🤸', sets: 3, holdSeconds: 20 },
    { id: 'inverted-row', name: 'Inverted Row Hold', emoji: '📐', sets: 3, holdSeconds: 30 },
    { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', sets: 3, holdSeconds: 60 },
    { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', sets: 2, holdSeconds: 60 },
  ] as any as ExercisePlan[],
};

const DEFAULT_PLAN: ExercisePlan[] = [
  { id: 'ex1', name: 'Exercise A', emoji: '🏋️', sets: 3, holdSeconds: 45 },
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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    cdRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(cdRef.current!);
          cdRef.current = null;
          beginHold();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
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
  };

  const resume = () => {
    setPhase('running');
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  };

  const stop = () => {
    clearTimers();
    setPhase('stopped');
    const record = { exercise: exercise.name, set: setIdx + 1, time: elapsed };
    setRecords((prev) => [...prev, record]);
    if (elapsed >= exercise.holdSeconds) {
      setPrFlash(true);
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
  useVoiceCommand({
    active: phase === 'running' || phase === 'countdown',
    onCommand: stop,
  });

  if (phase === 'summary') {
    const totalTime = records.reduce((sum, r) => sum + r.time, 0);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>🎉 Workout Complete!</Text>
          <Text style={styles.subtitle}>Total hold time: {formatTime(totalTime)}</Text>
          {records.map((r, i) => (
            <View key={i} style={styles.summaryCard}>
              <Text style={styles.summaryText}>{r.exercise} — Set {r.set}: {formatTime(r.time)}</Text>
            </View>
          ))}
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/programs')}>
            <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Text style={styles.ctaText}>🏠 Back to Programs</Text>
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
      </View>

      <View style={styles.timerWrap}>
        <Text style={styles.timer}>
          {phase === 'countdown' ? String(countdown) : formatTime(elapsed)}
        </Text>
        {phase === 'countdown' && <Text style={styles.timerLabel}>Get ready…</Text>}
      </View>

      {prFlash && (
        <View style={styles.prBanner}>
          <Text style={styles.prText}>🏆 Personal Record!</Text>
        </View>
      )}

      <View style={styles.controls}>
        {phase === 'idle' && (
          <TouchableOpacity activeOpacity={0.8} onPress={startCountdown}>
            <View style={[styles.controlBtn, { backgroundColor: Colors.success }]} >
              <Text style={styles.controlText}>▶️ Start</Text>
            </View>
          </TouchableOpacity>
        )}

        {phase === 'countdown' && (
          <View style={[styles.controlBtn, { backgroundColor: Colors.darkElevated }]} >
            <Text style={styles.controlText}>⏳ {countdown}</Text>
          </View>
        )}

        {phase === 'running' && (
          <>
            <TouchableOpacity activeOpacity={0.8} onPress={pause}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.warning }]} >
                <Text style={styles.controlText}>⏸️ Pause</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={stop}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.danger }]} >
                <Text style={styles.controlText}>⏹️ Stop</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {phase === 'paused' && (
          <TouchableOpacity activeOpacity={0.8} onPress={resume}>
            <View style={[styles.controlBtn, { backgroundColor: Colors.success }]} >
              <Text style={styles.controlText}>▶️ Resume</Text>
            </View>
          </TouchableOpacity>
        )}

        {phase === 'stopped' && (
          <>
            <TouchableOpacity activeOpacity={0.8} onPress={repeat}>
              <View style={[styles.controlBtn, { backgroundColor: Colors.info }]} >
                <Text style={styles.controlText}>🔁 Repeat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={next}>
              <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.controlBtn}>
                <Text style={styles.controlText}>⏭️ Next</Text>
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
});
