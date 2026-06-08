import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface ExerciseData {
  name: string;
  emoji: string;
  diagram: { label: string; detail: string }[];
  primary: string[];
  secondary: string[];
  instructions: string[];
  mistakes: string[];
  cue: string;
  holds: { beginner: string; intermediate: string; advanced: string };
}

const DATA: Record<string, ExerciseData> = {
  'wall-sit': {
    name: 'Wall Sit',
    emoji: '🪑',
    diagram: [
      { label: 'Back flat', detail: 'against wall' },
      { label: 'Knees at', detail: '90°' },
      { label: 'Feet flat', detail: 'on the ground' },
    ],
    primary: ['Quadriceps'],
    secondary: ['Glutes', 'Calves', 'Core (Abs)'],
    instructions: [
      'Stand with your back against a wall.',
      'Walk your feet forward about 2 feet.',
      'Slide down until knees reach 90 degrees.',
      'Keep your back flat against the wall.',
      'Hold the position with steady breathing.',
    ],
    mistakes: [
      'Knees past toes',
      'Hips too high',
      'Leaning forward',
    ],
    cue: 'Sit down, not forward.',
    holds: { beginner: '20 sec', intermediate: '60 sec', advanced: '120+ sec' },
  },
  'plank': {
    name: 'Dead-Stop Plank',
    emoji: '📏',
    diagram: [
      { label: 'Elbows under', detail: 'shoulders' },
      { label: 'Body straight', detail: 'head to heels' },
      { label: 'Toes on', detail: 'the ground' },
    ],
    primary: ['Core', 'Abs'],
    secondary: ['Shoulders', 'Glutes', 'Lower Back'],
    instructions: [
      'Lie face down and prop up on forearms.',
      'Elbows directly under your shoulders.',
      'Lift body so only forearms and toes touch.',
      'Keep a straight line from head to heels.',
      'Hold without sagging hips or arching.',
    ],
    mistakes: [
      'Hips sagging toward floor',
      'Head dropping — keep neutral neck',
      'Holding breath',
    ],
    cue: 'Brace like someone is going to punch your stomach.',
    holds: { beginner: '20 sec', intermediate: '60 sec', advanced: '120+ sec' },
  },
  'superman': {
    name: 'Superman Hold',
    emoji: '🦸',
    diagram: [
      { label: 'Arms extended', detail: 'overhead' },
      { label: 'Lift chest &', detail: 'legs off floor' },
      { label: 'Gaze neutral', detail: 'look ahead' },
    ],
    primary: ['Lower Back', 'Glutes'],
    secondary: ['Hamstrings', 'Core', 'Upper Back'],
    instructions: [
      'Lie face down with arms extended overhead.',
      'Simultaneously lift arms, chest, and legs.',
      'Keep gaze neutral — look slightly ahead.',
      'Hold the elevated position with control.',
      'Breathe steadily throughout.',
    ],
    mistakes: [
      'Overextending neck by looking up',
      'Jerky lifts instead of smooth raise',
      'Holding breath',
    ],
    cue: 'Fly like Superman. Long body, not a banana.',
    holds: { beginner: '15 sec', intermediate: '45 sec', advanced: '90+ sec' },
  },
  'push-up-hold': {
    name: 'Mid-Range Push-Up Hold',
    emoji: '💪',
    diagram: [
      { label: 'Elbows at', detail: '~90°' },
      { label: 'Body rigid', detail: 'straight line' },
      { label: 'Shoulders over', detail: 'your hands' },
    ],
    primary: ['Chest', 'Triceps'],
    secondary: ['Core', 'Shoulders', 'Front Delts'],
    instructions: [
      'Start in a standard push-up position.',
      'Lower yourself halfway down.',
      'Elbows at roughly 90 degrees.',
      'Hold the midpoint without touching floor.',
      'Keep body rigid and core engaged.',
    ],
    mistakes: [
      'Letting hips sag or pike upward',
      'Elbows flaring too wide',
      'Not keeping shoulders over hands',
    ],
    cue: 'Hold the bottom of the push-up like a statue.',
    holds: { beginner: '10 sec', intermediate: '30 sec', advanced: '60+ sec' },
  },
  'horse-stance': {
    name: 'Horse Stance',
    emoji: '🐴',
    diagram: [
      { label: 'Feet wide', detail: 'toes out' },
      { label: 'Thighs parallel', detail: 'to ground' },
      { label: 'Back straight', detail: 'chest open' },
    ],
    primary: ['Adductors', 'Quads'],
    secondary: ['Glutes', 'Core', 'Ankles', 'Calves'],
    instructions: [
      'Stand with feet wider than shoulder-width.',
      'Toes pointing slightly outward.',
      'Lower hips until thighs are parallel.',
      'Keep back straight and chest open.',
      'Hold with steady, deep breathing.',
    ],
    mistakes: [
      'Knees caving inward',
      'Heels lifting off ground',
      'Leaning torso too far forward',
    ],
    cue: 'Spread the floor apart with your feet.',
    holds: { beginner: '30 sec', intermediate: '90 sec', advanced: '180+ sec' },
  },
};

const DEFAULT: ExerciseData = {
  name: 'Exercise',
  emoji: '🏋️',
  diagram: [
    { label: 'Position', detail: 'your body' },
    { label: 'Maintain', detail: 'good form' },
    { label: 'Hold', detail: 'with control' },
  ],
  primary: ['Full Body'],
  secondary: ['Core', 'Stabilizers'],
  instructions: [
    'Assume the starting position.',
    'Engage the target muscles.',
    'Hold with controlled breathing.',
  ],
  mistakes: [
    'Rushing the movement',
    'Poor posture',
  ],
  cue: 'Quality over quantity.',
  holds: { beginner: '20 sec', intermediate: '45 sec', advanced: '90 sec' },
};

function MuscleBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.muscleBadge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <View style={[styles.muscleDot, { backgroundColor: color }]} />
      <Text style={[styles.muscleBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

function GoalCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.goalCard, { borderColor: `${color}30` }]}>
      <Text style={[styles.goalLabel, { color }]}>{label}</Text>
      <Text style={styles.goalValue}>{value}</Text>
    </View>
  );
}

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ex = DATA[id ?? ''] ?? DEFAULT;
  const [fav, setFav] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.emoji}>{ex.emoji}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setFav((f) => !f)} style={styles.starBtn}>
            <Text style={styles.star}>{fav ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{ex.name}</Text>

        {/* Diagram + Muscles Row */}
        <View style={styles.diagramRow}>
          {/* Diagram Panel */}
          <View style={styles.diagramPanel}>
            <Text style={styles.panelTitle}>Exercise Position</Text>
            {ex.diagram.map((d, i) => (
              <View key={i} style={styles.diagramItem}>
                <View style={styles.diagramNumber}>
                  <Text style={styles.diagramNumberText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.diagramLabel}>{d.label}</Text>
                  <Text style={styles.diagramDetail}>{d.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Muscles Panel */}
          <View style={styles.musclesPanel}>
            <Text style={styles.panelTitle}>Muscles Worked</Text>

            <Text style={styles.muscleSectionLabel}>Primary</Text>
            <View style={styles.muscleGroup}>
              {ex.primary.map((m) => (
                <MuscleBadge key={m} label={m} color={Colors.danger} />
              ))}
            </View>

            <Text style={styles.muscleSectionLabel}>Secondary</Text>
            <View style={styles.muscleGroup}>
              {ex.secondary.map((m) => (
                <MuscleBadge key={m} label={m} color={Colors.orange} />
              ))}
            </View>
          </View>
        </View>

        {/* How to Perform */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Perform</Text>
          {ex.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Common Mistakes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.danger }]}>Common Mistakes</Text>
          {ex.mistakes.map((m, i) => (
            <View key={i} style={styles.mistakeRow}>
              <Text style={styles.mistakeIcon}>❌</Text>
              <Text style={styles.mistakeText}>{m}</Text>
            </View>
          ))}
        </View>

        {/* Coach Cue */}
        <View style={styles.cueCard}>
          <Text style={styles.cueLabel}>💬 Coach Cue</Text>
          <Text style={styles.cueText}>"{ex.cue}"</Text>
        </View>

        {/* Goal Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Holds</Text>
          <View style={styles.goalsRow}>
            <GoalCard label="Beginner" value={ex.holds.beginner} color={Colors.success} />
            <GoalCard label="Intermediate" value={ex.holds.intermediate} color={Colors.gold} />
            <GoalCard label="Advanced" value={ex.holds.advanced} color={Colors.orange} />
          </View>
        </View>

        {/* Start Workout Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/workout/${id}`)}>
          <LinearGradient
            colors={[Colors.orange, Colors.orangeLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>▶️ Start Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emoji: { fontSize: FontSizes.hero },
  starBtn: { padding: Spacing.sm },
  star: { color: Colors.gold, fontSize: FontSizes['3xl'] },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },

  diagramRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  diagramPanel: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  musclesPanel: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  panelTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  diagramItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  diagramNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagramNumberText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  diagramLabel: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  diagramDetail: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
  },

  muscleSectionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  muscleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  muscleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  muscleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  muscleBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },

  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  stepText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.base,
    lineHeight: 22,
    flex: 1,
  },

  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  mistakeIcon: {
    fontSize: FontSizes.base,
  },
  mistakeText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.base,
  },

  cueCard: {
    backgroundColor: `${Colors.blue}10`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${Colors.blue}30`,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cueLabel: {
    color: Colors.blue,
    fontSize: FontSizes.sm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cueText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  goalsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  goalCard: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  goalValue: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '800',
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
