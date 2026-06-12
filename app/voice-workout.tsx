import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

export default function VoiceWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const sessionName = (params.name as string) || 'Session';
  const workTime = parseInt((params.workTime as string) || '40', 10);
  const restTime = parseInt((params.restTime as string) || '20', 10);
  const rounds = parseInt((params.rounds as string) || '4', 10);
  const exercises: string[] = params.exercises
    ? JSON.parse(params.exercises as string)
    : ['Plank', 'Push-Up', 'Squat'];

  const [phase, setPhase] = useState<'idle' | 'countdown' | 'work' | 'rest' | 'done'>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === exercises.length - 1;
  const isLastRound = currentRound === rounds;

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('[Coach]', text);
    }
  }, []);

  const startCountdown = () => {
    setPhase('countdown');
    let count = 5;
    setTimer(count);
    speak('Get ready.');
    intervalRef.current = setInterval(() => {
      count -= 1;
      setTimer(count);
      if (count > 0) speak(`${count}`);
      if (count <= 0) {
        clear();
        startWork();
      }
    }, 1000);
  };

  const startWork = () => {
    setPhase('work');
    setTimer(workTime);
    speak(`Begin ${currentExercise}.`);
    let remaining = workTime;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setTimer(remaining);
      setTotalTime((t) => t + 1);
      if (remaining <= 0) {
        clear();
        if (isLastExercise && isLastRound) {
          finishSession();
        } else {
          startRest();
        }
      }
    }, 1000);
  };

  const startRest = () => {
    setPhase('rest');
    setTimer(restTime);
    speak('Rest.');
    let remaining = restTime;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setTimer(remaining);
      setTotalTime((t) => t + 1);
      if (remaining <= 0) {
        clear();
        if (isLastExercise) {
          setCurrentRound((r) => r + 1);
          setCurrentIndex(0);
          startWork();
        } else {
          setCurrentIndex((i) => i + 1);
          startWork();
        }
      }
    }, 1000);
  };

  const finishSession = () => {
    setPhase('done');
    clear();
    speak('Session complete. Great work.');
  };

  const handleStart = () => {
    startCountdown();
  };

  const handlePause = () => {
    clear();
    setPhase('idle');
  };

  const handleSkip = () => {
    clear();
    if (isLastExercise && isLastRound) {
      finishSession();
    } else {
      startRest();
    }
  };

  const handleEnd = () => {
    clear();
    router.back();
  };

  const [lastHeard, setLastHeard] = useState('');

  // Voice command: listen for "stop" while timer is active
  const handleStop = useCallback(() => {
    clear();
    setPhase('done');
    speak('Session ended. Logging time.');
  }, [clear, speak]);

  const { listening } = useVoiceCommand({
    active: phase === 'countdown' || phase === 'work' || phase === 'rest',
    onCommand: handleStop,
    transcript: (text) => setLastHeard(text),
  });

  useEffect(() => {
    return () => clear();
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const phaseColor = phase === 'work' ? Colors.orange : phase === 'rest' ? Colors.blue : Colors.textSecondary;

  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.doneEmoji}></Text>
          <Text style={styles.doneTitle}>Session Complete</Text>
          <Text style={styles.doneSub}>{sessionName}</Text>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{rounds}</Text>
              <Text style={styles.statLabel}>Rounds</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{exercises.length}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={handleEnd} activeOpacity={0.85}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>{sessionName}</Text>
          <Text style={styles.headerMeta}>Round {currentRound} / {rounds}</Text>
        </View>

        {/* Timer Circle */}
        <View style={styles.timerCircle}>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>
            {phase === 'idle' ? 'Ready' : phase === 'countdown' ? 'Starting...' : phase === 'work' ? 'WORK' : 'REST'}
          </Text>
          <Text style={styles.timerValue}>{timer}</Text>
          <Text style={styles.timerUnit}>seconds</Text>
        </View>

        {/* Exercise Info */}
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseLabel}>Current Exercise</Text>
          <Text style={styles.exerciseName}>{currentExercise}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / exercises.length) * 100}%`,
                  backgroundColor: phaseColor,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Exercise {currentIndex + 1} / {exercises.length}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {phase === 'idle' ? (
            <TouchableOpacity style={styles.controlButton} onPress={handleStart} activeOpacity={0.85}>
              <Text style={styles.controlButtonText}>▶ Start</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.controlButtonSecondary} onPress={handlePause} activeOpacity={0.85}>
                <Text style={styles.controlButtonSecondaryText}> Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButtonSecondary} onPress={handleSkip} activeOpacity={0.85}>
                <Text style={styles.controlButtonSecondaryText}> Skip</Text>
              </TouchableOpacity>
            </>
          )}
          {phase === 'idle' && <Text style={styles.stopCue}>SAY STOP TO END EXERCISE</Text>}
          <TouchableOpacity style={styles.controlButtonDanger} onPress={handleEnd} activeOpacity={0.85}>
            <Text style={styles.controlButtonDangerText}> End</Text>
          </TouchableOpacity>
        </View>

        {/* Voice status */}
        {(listening || lastHeard) && (
          <View style={styles.micRow}>
            {listening && <View style={styles.micDot} />}
            <Text style={styles.micText}>
              {listening ? ' Listening' : ''}
              {lastHeard ? `  ·  Heard: "${lastHeard}"` : ''}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  headerText: { fontSize: FontSizes.xl, color: Colors.textPrimary, fontWeight: '800' },
  headerMeta: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '700' },
  timerCircle: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.darkCard,
    marginBottom: Spacing.xxl,
  },
  phaseLabel: { fontSize: FontSizes.lg, fontWeight: '800', textTransform: 'uppercase', marginBottom: Spacing.sm },
  timerValue: { fontSize: 72, color: Colors.textPrimary, fontWeight: '900', lineHeight: 80 },
  timerUnit: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  exerciseCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    marginBottom: Spacing.xl,
  },
  exerciseLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.xs, fontWeight: '600' },
  exerciseName: { fontSize: FontSizes['2xl'], color: Colors.textPrimary, fontWeight: '800', marginBottom: Spacing.md },
  progressBar: { height: 6, backgroundColor: Colors.darkElevated, borderRadius: 3, marginBottom: Spacing.sm },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  controls: { gap: Spacing.md },
  controlButton: {
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  controlButtonText: { color: '#000', fontWeight: '800', fontSize: FontSizes.lg },
  controlButtonSecondary: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  controlButtonSecondaryText: { color: Colors.textPrimary, fontWeight: '800', fontSize: FontSizes.lg },
  controlButtonDanger: {
    backgroundColor: `${Colors.danger}20`,
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.danger}40`,
  },
  controlButtonDangerText: { color: Colors.danger, fontWeight: '800', fontSize: FontSizes.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl },
  doneEmoji: { fontSize: 64, marginBottom: Spacing.md },
  doneTitle: { fontSize: FontSizes['3xl'], color: Colors.textPrimary, fontWeight: '800', marginBottom: Spacing.sm },
  doneSub: { fontSize: FontSizes.lg, color: Colors.textSecondary, marginBottom: Spacing.xl },
  statRow: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.xxl },
  stat: { alignItems: 'center' },
  statValue: { fontSize: FontSizes['2xl'], color: Colors.orange, fontWeight: '900' },
  statLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  doneButton: {
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  doneButtonText: { color: '#000', fontWeight: '800', fontSize: FontSizes.lg },
  micRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.xs, paddingHorizontal: Spacing.md },
  micDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  micText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  stopCue: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: FontSizes.sm,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
