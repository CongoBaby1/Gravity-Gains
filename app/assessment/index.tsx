import { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

const TESTS = [
  { id: 'wall-sit', name: 'Wall Sit', emoji: '', category: 'Leg Strength' },
  { id: 'plank', name: 'Dead-Stop Plank', emoji: '', category: 'Core Strength' },
  { id: 'superman', name: 'Superman Hold', emoji: '', category: 'Posterior Chain' },
  { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '', category: 'Upper Body' },
  { id: 'horse-stance', name: 'Horse Stance Hold', emoji: '', category: 'Mobility' },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function scoreFromSeconds(seconds: number, max: number) {
  const ratio = Math.min(seconds / max, 1);
  return Math.round(ratio * 200);
}

export default function AssessmentScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'running' | 'done'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [scoresVisible, setScoresVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTest = TESTS[activeIndex];

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const startTest = () => {
    setPhase('countdown');
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
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

  const stopTest = () => {
    clearTimers();
    setPhase('done');
    setResults((prev) => ({ ...prev, [currentTest.id]: elapsed }));
  };

  const nextTest = () => {
    if (activeIndex < TESTS.length - 1) {
      setActiveIndex((i) => i + 1);
      setPhase('idle');
      setElapsed(0);
      setCountdown(5);
    } else {
      setScoresVisible(true);
    }
  };

  const resetAll = () => {
    setActiveIndex(0);
    setPhase('idle');
    setElapsed(0);
    setCountdown(5);
    setResults({});
    setScoresVisible(false);
  };

  const legScore = scoreFromSeconds(results['wall-sit'] ?? 0, 300);
  const coreScore = scoreFromSeconds(results['plank'] ?? 0, 240);
  const posteriorScore = scoreFromSeconds(results['superman'] ?? 0, 180);
  const upperScore = scoreFromSeconds(results['push-up-hold'] ?? 0, 240);
  const mobilityScore = scoreFromSeconds(results['horse-stance'] ?? 0, 300);
  const consistencyBonus = Object.keys(results).length * 10;
  const totalScore = Math.min(legScore + coreScore + posteriorScore + upperScore + mobilityScore + consistencyBonus, 1000);

  useEffect(() => {
    if (scoresVisible && totalScore > (user?.gravityScore ?? 0)) {
      updateUser({ gravityScore: totalScore });
    }
  }, [scoresVisible]);

  if (scoresVisible) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}> Gravity Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{totalScore}</Text>
            <Text style={styles.scoreLabel}>/ 1000</Text>
          </View>

          {[
            { label: 'Leg Strength', score: legScore, color: Colors.orange },
            { label: 'Core Strength', score: coreScore, color: Colors.blue },
            { label: 'Upper Body', score: upperScore, color: Colors.gold },
            { label: 'Posterior Chain', score: posteriorScore, color: Colors.success },
            { label: 'Mobility', score: mobilityScore, color: Colors.warning },
            { label: 'Consistency', score: consistencyBonus, color: Colors.info },
          ].map((cat) => (
            <View key={cat.label} style={styles.scoreCard}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreCat}>{cat.label}</Text>
                <Text style={styles.scoreVal}>{cat.score}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFg, { width: `${(cat.score / 200) * 100}%`, backgroundColor: cat.color }]} />
              </View>
            </View>
          ))}

          <TouchableOpacity activeOpacity={0.8} onPress={resetAll} style={{ marginTop: Spacing.lg }}>
            <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Text style={styles.ctaText}> Retake Assessment</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)')}>
            <View style={[styles.cta, { backgroundColor: Colors.darkElevated, marginTop: Spacing.md }]} >
              <Text style={[styles.ctaText, { color: Colors.textPrimary }]}> Go Home</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}> Gravity Assessment</Text>
        <Text style={styles.subtitle}>Test {activeIndex + 1} of {TESTS.length}</Text>

        <View style={styles.testCard}>
          <Text style={styles.testEmoji}>{currentTest.emoji}</Text>
          <Text style={styles.testName}>{currentTest.name}</Text>
          <Text style={styles.testCategory}>Category: {currentTest.category}</Text>

          <View style={styles.timerBox}>
            <Text style={styles.timerText}>
              {phase === 'countdown' ? countdown : phase === 'running' ? formatTime(elapsed) : phase === 'done' ? formatTime(results[currentTest.id] ?? 0) : '00:00'}
            </Text>
          </View>

          {phase === 'idle' && (
            <>
              <View style={styles.startStopRow}>
                <TouchableOpacity activeOpacity={0.8} onPress={startTest} style={{ flex: 1 }}>
                  <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                    <Text style={styles.ctaText}>▶ Start</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={stopTest} style={[styles.stopBtn, { marginLeft: Spacing.md }]}>
                  <View style={[styles.cta, { backgroundColor: Colors.danger }]} >
                    <Text style={[styles.ctaText, { color: '#fff' }]}> Stop</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.stopCue}>SAY STOP TO END EXERCISE</Text>
            </>
          )}

          {phase === 'countdown' && (
            <View style={[styles.cta, { backgroundColor: Colors.darkElevated }]} >
              <Text style={[styles.ctaText, { color: Colors.textPrimary }]}>Get ready…</Text>
            </View>
          )}

          {phase === 'running' && (
            <TouchableOpacity activeOpacity={0.8} onPress={stopTest}>
              <View style={[styles.cta, { backgroundColor: Colors.danger }]} >
                <Text style={styles.ctaText}> Stop</Text>
              </View>
            </TouchableOpacity>
          )}

          {phase === 'done' && (
            <TouchableOpacity activeOpacity={0.8} onPress={nextTest}>
              <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                <Text style={styles.ctaText}> {activeIndex < TESTS.length - 1 ? 'Next Test' : 'See Results'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { color: Colors.textPrimary, fontSize: FontSizes['3xl'], fontWeight: 'bold', marginBottom: Spacing.xs },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.lg, marginBottom: Spacing.lg },
  testCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  testEmoji: { fontSize: FontSizes.hero, marginBottom: Spacing.sm },
  testName: { color: Colors.textPrimary, fontSize: FontSizes['2xl'], fontWeight: '700', marginBottom: Spacing.xs },
  testCategory: { color: Colors.textSecondary, fontSize: FontSizes.base, marginBottom: Spacing.lg },
  timerBox: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    minWidth: 220,
    alignItems: 'center',
  },
  timerText: { color: Colors.textPrimary, fontSize: FontSizes['5xl'], fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  cta: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  ctaText: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSizes.lg },
  startStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stopBtn: {
    backgroundColor: Colors.danger,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  stopCue: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: FontSizes.sm,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.darkCard,
    borderWidth: 4,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  scoreNumber: { color: Colors.gold, fontSize: FontSizes.hero, fontWeight: 'bold' },
  scoreLabel: { color: Colors.textSecondary, fontSize: FontSizes.lg, marginTop: Spacing.xs },
  scoreCard: { marginBottom: Spacing.md },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  scoreCat: { color: Colors.textPrimary, fontSize: FontSizes.base },
  scoreVal: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700' },
  barBg: { height: 10, backgroundColor: Colors.darkElevated, borderRadius: 5, overflow: 'hidden' },
  barFg: { height: '100%', borderRadius: 5 },
});
