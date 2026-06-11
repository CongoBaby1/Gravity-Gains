import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const EXERCISES = [
  { id: 'wall-sit', name: 'Wall Sit', emoji: '' },
  { id: 'plank', name: 'Dead-Stop Plank', emoji: '' },
  { id: 'superman', name: 'Superman Hold', emoji: '' },
  { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '' },
  { id: 'horse-stance', name: 'Horse Stance', emoji: '' },
  { id: 'cat-cow', name: 'Cat-Cow', emoji: '' },
];

export default function BuildSessionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [workTime, setWorkTime] = useState('40');
  const [restTime, setRestTime] = useState('20');
  const [rounds, setRounds] = useState('4');

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedExercises = EXERCISES.filter((e) => selected.has(e.id));
  const canStart = selectedExercises.length > 0;

  const handleStart = () => {
    if (!canStart) return;
    const names = selectedExercises.map((e) => e.name);
    router.push({
      pathname: '/voice-workout',
      params: {
        name: 'Custom Session',
        workTime,
        restTime,
        rounds,
        exercises: JSON.stringify(names),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}> Build Session</Text>
        <Text style={styles.sub}>Pick exercises and set your intervals</Text>

        {/* Exercise Selector */}
        <Text style={styles.sectionTitle}>Select Exercises ({selected.size})</Text>
        <View style={styles.exerciseGrid}>
          {EXERCISES.map((ex) => {
            const active = selected.has(ex.id);
            return (
              <TouchableOpacity
                key={ex.id}
                activeOpacity={0.8}
                onPress={() => toggle(ex.id)}
                style={[
                  styles.exerciseChip,
                  active && { backgroundColor: Colors.orange, borderColor: Colors.orange },
                ]}
              >
                <Text style={styles.exerciseChipEmoji}>{ex.emoji}</Text>
                <Text
                  style={[
                    styles.exerciseChipText,
                    active && { color: '#000', fontWeight: '700' },
                  ]}
                >
                  {ex.name}
                </Text>
                {active && <Text style={styles.checkMark}></Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Interval Settings */}
        <Text style={styles.sectionTitle}>Interval Settings</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work (sec)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={workTime}
              onChangeText={setWorkTime}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rest (sec)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={restTime}
              onChangeText={setRestTime}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rounds</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={rounds}
              onChangeText={setRounds}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        {/* Summary */}
        {canStart && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              {selected.size} exercise{selected.size > 1 ? 's' : ''} · {workTime}s work · {restTime}s rest · {rounds} round{parseInt(rounds) > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Start Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleStart} disabled={!canStart}>
          <LinearGradient
            colors={canStart ? [Colors.orange, Colors.orangeLight] : ['#555', '#555']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.cta, !canStart && { opacity: 0.5 }]}
          >
            <Text style={styles.ctaText}>▶ Start Custom Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nearBlack,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    fontSize: FontSizes['3xl'],
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  sub: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  exerciseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.xs,
  },
  exerciseChipEmoji: {
    fontSize: 16,
  },
  exerciseChipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  checkMark: {
    color: '#000',
    fontWeight: '800',
    fontSize: FontSizes.sm,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  summaryText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  cta: {
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ctaText: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: FontSizes.lg,
  },
});
