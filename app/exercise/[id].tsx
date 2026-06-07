import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface ExerciseData {
  name: string;
  emoji: string;
  primary: string;
  secondary: string;
  instructions: string[];
  mistakes: string[];
  tips: string[];
  holds: { beginner: string; intermediate: string; advanced: string };
}

const DATA: Record<string, ExerciseData> = {
  'wall-sit': {
    name: 'Wall Sit',
    emoji: '🪑',
    primary: 'Quads, Glutes',
    secondary: 'Core, Calves',
    instructions: [
      'Stand with your back flat against a wall.',
      'Slide down until knees are at 90° and thighs parallel to the floor.',
      'Keep feet shoulder-width apart and flat on the ground.',
      'Rest arms at your sides or extend them forward for balance.',
      'Hold position while breathing steadily.',
    ],
    mistakes: [
      'Knees extending past toes',
      'Lifting heels off the floor',
      'Rounding lower back away from wall',
    ],
    tips: [
      'Press lower back firmly into the wall for spine safety',
      'Engage core to reduce hip flexor strain',
      'Start shorter and build up each week',
    ],
    holds: { beginner: '30 sec', intermediate: '90 sec', advanced: '3+ min' },
  },
  'plank': {
    name: 'Dead-Stop Plank',
    emoji: '📏',
    primary: 'Core, Abs',
    secondary: 'Shoulders, Glutes',
    instructions: [
      'Lie face down and prop up on forearms with elbows under shoulders.',
      'Lift body so only forearms and toes touch the ground.',
      'Keep body in a straight line from head to heels.',
      'Hold without sagging hips or arching back.',
    ],
    mistakes: [
      'Hips sagging toward floor',
      'Head dropping — keep neutral neck',
      'Holding breath instead of steady breathing',
    ],
    tips: [
      'Squeeze glutes to stabilize the posterior chain',
      'Look slightly ahead, not down at your hands',
      'Rest when form breaks — quality over quantity',
    ],
    holds: { beginner: '20 sec', intermediate: '60 sec', advanced: '2+ min' },
  },
  'superman': {
    name: 'Superman Hold',
    emoji: '🦸',
    primary: 'Lower Back, Glutes',
    secondary: 'Hamstrings, Core',
    instructions: [
      'Lie face down with arms extended overhead.',
      'Simultaneously lift arms, chest, and legs off the floor.',
      'Keep gaze neutral — look at the floor slightly ahead.',
      'Hold the elevated position with controlled breathing.',
    ],
    mistakes: [
      'Overextending neck by looking up',
      'Jerky lifts instead of smooth controlled raise',
      'Holding breath',
    ],
    tips: [
      'Lift only as high as you can control',
      'Pause at top for 1-2 seconds each rep',
      'Pair with core work for balanced posterior chain',
    ],
    holds: { beginner: '15 sec', intermediate: '45 sec', advanced: '90 sec' },
  },
  'push-up-hold': {
    name: 'Mid-Range Push-Up Hold',
    emoji: '💪',
    primary: 'Chest, Triceps',
    secondary: 'Core, Shoulders',
    instructions: [
      'Start in a standard push-up position.',
      'Lower yourself halfway so elbows are at ~90°.',
      'Hold that midpoint without touching the floor.',
      'Keep body rigid and core engaged.',
    ],
    mistakes: [
      'Letting hips sag or pike upward',
      'Elbows flaring too wide',
      'Not keeping shoulders over hands',
    ],
    tips: [
      'Micro-adjust hand width to find strongest angle',
      'Breathe shallowly to avoid collapsing',
      'Use a mirror or video to check form',
    ],
    holds: { beginner: '10 sec', intermediate: '30 sec', advanced: '60+ sec' },
  },
  'horse-stance': {
    name: 'Horse Stance',
    emoji: '🐴',
    primary: 'Adductors, Quads',
    secondary: 'Glutes, Core, Ankles',
    instructions: [
      'Stand with feet wider than shoulder-width, toes pointing slightly outward.',
      'Lower hips until thighs are roughly parallel to the ground.',
      'Keep back straight and chest open.',
      'Hold with steady, deep breathing.',
    ],
    mistakes: [
      'Knees caving inward',
      'Heels lifting off ground',
      'Leaning torso too far forward',
    ],
    tips: [
      'Drive knees outward actively',
      'Practice ankle mobility if heels rise',
      'Build time gradually — this is a marathon hold',
    ],
    holds: { beginner: '30 sec', intermediate: '90 sec', advanced: '3+ min' },
  },
};

const DEFAULT: ExerciseData = {
  name: 'Exercise',
  emoji: '🏋️',
  primary: 'Full Body',
  secondary: 'Core',
  instructions: ['Perform with control.', 'Hold the position.', 'Breathe steadily.'],
  mistakes: ['Rushing the movement', 'Poor posture'],
  tips: ['Focus on form', 'Progress gradually'],
  holds: { beginner: '20 sec', intermediate: '45 sec', advanced: '90 sec' },
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ex = DATA[id ?? ''] ?? DEFAULT;
  const [fav, setFav] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.emoji}>{ex.emoji}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setFav((f) => !f)} style={styles.starBtn}>
            <Text style={styles.star}>{fav ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{ex.name}</Text>

        {/* Muscle highlight placeholder */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Muscles</Text>
          <Text style={styles.cardText}>Primary: {ex.primary}</Text>
          <Text style={styles.cardText}>Secondary: {ex.secondary}</Text>
        </View>

        {/* Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Instructions</Text>
          {ex.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.badge}><Text style={styles.badgeText}>{i + 1}</Text></View>
              <Text style={styles.cardText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Mistakes */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: Colors.danger }]}>⚠️ Common Mistakes</Text>
          {ex.mistakes.map((m, i) => (
            <Text key={i} style={[styles.cardText, { color: Colors.textSecondary }]}>• {m}</Text>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: Colors.success }]}>💡 Coach Tips</Text>
          {ex.tips.map((t, i) => (
            <Text key={i} style={[styles.cardText, { color: Colors.textSecondary }]}>• {t}</Text>
          ))}
        </View>

        {/* Target holds */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Target Holds</Text>
          <View style={styles.holdRow}>
            <View style={styles.holdBox}>
              <Text style={styles.holdLabel}>Beginner</Text>
              <Text style={styles.holdValue}>{ex.holds.beginner}</Text>
            </View>
            <View style={styles.holdBox}>
              <Text style={styles.holdLabel}>Intermediate</Text>
              <Text style={styles.holdValue}>{ex.holds.intermediate}</Text>
            </View>
            <View style={styles.holdBox}>
              <Text style={styles.holdLabel}>Advanced</Text>
              <Text style={styles.holdValue}>{ex.holds.advanced}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/workout/${id}`)}>
          <LinearGradient colors={[Colors.orange, Colors.orangeLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
            <Text style={styles.ctaText}>▶️ Start Exercise</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  emoji: { fontSize: FontSizes.hero },
  starBtn: { padding: Spacing.sm },
  star: { color: Colors.gold, fontSize: FontSizes['3xl'] },
  title: { color: Colors.textPrimary, fontSize: FontSizes['3xl'], fontWeight: 'bold', marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '700', marginBottom: Spacing.sm },
  cardText: { color: Colors.textSecondary, fontSize: FontSizes.base, marginBottom: Spacing.xs, lineHeight: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm, gap: Spacing.sm },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: '700' },
  holdRow: { flexDirection: 'row', gap: Spacing.md },
  holdBox: {
    flex: 1,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  holdLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  holdValue: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '700', marginTop: Spacing.xs },
  cta: {
    borderRadius: 14,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ctaText: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSizes.lg },
});
