import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const { width } = Dimensions.get('window');

// Exercise images mapping — updated Jun 9 2026
const EXERCISE_IMAGES: Record<string, any> = {
  'wall-sit': require('@/assets/exercises/wall-sit.png'),
  'plank': require('@/assets/exercises/plank.png'),
  'superman': require('@/assets/exercises/superman.png'),
  'push-up-hold': require('@/assets/exercises/push-up-hold.png'),
  'horse-stance': require('@/assets/exercises/horse-stance.png'),
  'cat-cow': require('@/assets/exercises/cat-cow.png'),
};

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
  'air-squat': {
    name: 'Air Squat',
    emoji: '🦵',
    diagram: [
      { label: 'Feet shoulder', detail: 'width apart' },
      { label: 'Hips below', detail: 'knees' },
      { label: 'Weight on', detail: 'heels' },
    ],
    primary: ['Quads', 'Glutes'],
    secondary: ['Hamstrings', 'Core', 'Calves'],
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Push hips back and bend knees.',
      'Lower until hips are below knees.',
      'Keep chest up and back straight.',
      'Drive through heels to stand.',
    ],
    mistakes: [
      'Knees caving inward',
      'Heels lifting off the ground',
      'Rounding the lower back',
    ],
    cue: 'Sit back into a chair, don\'t fold forward.',
    holds: { beginner: '15 reps', intermediate: '25 reps', advanced: '50+ reps' },
  },
  'lunge-walk': {
    name: 'Lunge Walk',
    emoji: '🚶',
    diagram: [
      { label: 'Step forward', detail: 'long stride' },
      { label: 'Back knee', detail: 'almost touches floor' },
      { label: 'Torso tall', detail: 'chest up' },
    ],
    primary: ['Quads', 'Glutes'],
    secondary: ['Hamstrings', 'Calves', 'Core', 'Hips'],
    instructions: [
      'Stand tall with feet together.',
      'Take a long step forward with one foot.',
      'Lower back knee toward the ground.',
      'Keep front knee over ankle.',
      'Push back up and step through.',
    ],
    mistakes: [
      'Front knee going past toes',
      'Torso leaning too far forward',
      'Short stride — step longer',
    ],
    cue: 'Drop the back knee, not the front.',
    holds: { beginner: '10 steps each', intermediate: '20 steps each', advanced: '40+ steps each' },
  },
  'hollow-body': {
    name: 'Hollow Body Hold',
    emoji: '🍩',
    diagram: [
      { label: 'Lower back', detail: 'pressed to floor' },
      { label: 'Arms & legs', detail: 'both elevated' },
      { label: 'Point toes', detail: 'squeeze abs' },
    ],
    primary: ['Core', 'Abs'],
    secondary: ['Hip Flexors', 'Quads', 'Shoulders'],
    instructions: [
      'Lie on your back, arms overhead.',
      'Press lower back firmly into the floor.',
      'Lift legs and shoulders simultaneously.',
      'Form a shallow banana shape.',
      'Hold with arms and legs slightly off the ground.',
    ],
    mistakes: [
      'Lower back arching off the floor',
      'Holding breath',
      'Legs too high — keep them low',
    ],
    cue: 'Press your lower back into the floor like you\'re trying to crush a grape.',
    holds: { beginner: '10 sec', intermediate: '30 sec', advanced: '60+ sec' },
  },
  'pull-up': {
    name: 'Pull-Up',
    emoji: '🤸',
    diagram: [
      { label: 'Hang fully', detail: 'arms straight' },
      { label: 'Pull chest', detail: 'to bar' },
      { label: 'Chin over', detail: 'the bar' },
    ],
    primary: ['Lats', 'Biceps'],
    secondary: ['Rear Delts', 'Core', 'Forearms', 'Traps'],
    instructions: [
      'Hang from a bar with arms fully extended.',
      'Pull your shoulder blades down and back.',
      'Drive elbows down to pull chest toward the bar.',
      'Get chin above the bar.',
      'Lower with control to full extension.',
    ],
    mistakes: [
      'Swinging or kipping for momentum',
      'Partial range — not full extension',
      'Shrugging shoulders up instead of down',
    ],
    cue: 'Pull your elbows into your back pockets.',
    holds: { beginner: '3 reps', intermediate: '8 reps', advanced: '15+ reps' },
  },
  'inverted-row': {
    name: 'Inverted Row',
    emoji: '📐',
    diagram: [
      { label: 'Body under', detail: 'bar or rings' },
      { label: 'Pull chest', detail: 'to bar' },
      { label: 'Body straight', detail: 'core tight' },
    ],
    primary: ['Lats', 'Rear Delts', 'Biceps'],
    secondary: ['Core', 'Traps', 'Forearms'],
    instructions: [
      'Set a bar at waist height.',
      'Lie underneath and grip the bar.',
      'Keep body straight like a plank.',
      'Pull chest to the bar.',
      'Lower with control, straight arms at bottom.',
    ],
    mistakes: [
      'Sagging hips or arching back',
      'Not pulling chest all the way to bar',
      'Flaring elbows too wide',
    ],
    cue: 'Pull your chest through the bar, not just to it.',
    holds: { beginner: '5 reps', intermediate: '12 reps', advanced: '20+ reps' },
  },
  'glute-bridge': {
    name: 'Glute Bridge',
    emoji: '🍑',
    diagram: [
      { label: 'Feet flat', detail: 'shoulder-width' },
      { label: 'Hips up', detail: 'squeeze glutes' },
      { label: 'Body straight', detail: 'knee to shoulder' },
    ],
    primary: ['Glutes', 'Hamstrings'],
    secondary: ['Core', 'Lower Back', 'Adductors'],
    instructions: [
      'Lie on your back, knees bent, feet flat.',
      'Drive through your heels.',
      'Lift hips until body is straight from knees to shoulders.',
      'Squeeze glutes hard at the top.',
      'Lower with control, don\'t touch down.',
    ],
    mistakes: [
      'Hyperextending lower back at top',
      'Pushing through toes instead of heels',
      'Not squeezing glutes at the top',
    ],
    cue: 'Squeeze your cheeks like you\'re cracking a walnut.',
    holds: { beginner: '10 reps', intermediate: '20 reps', advanced: '30+ reps' },
  },
  'single-leg-rdl': {
    name: 'Single-Leg RDL',
    emoji: '🦵',
    diagram: [
      { label: 'One foot', detail: 'on the ground' },
      { label: 'Hips hinge', detail: 'back and down' },
      { label: 'Back flat', detail: 'like a tabletop' },
    ],
    primary: ['Hamstrings', 'Glutes'],
    secondary: ['Core', 'Adductors', 'Lower Back', 'Ankles'],
    instructions: [
      'Stand on one foot, slight knee bend.',
      'Hinge at the hips, send the other leg back.',
      'Lower torso until it is nearly parallel to the ground.',
      'Keep back flat and core braced.',
      'Drive hips forward to return upright.',
    ],
    mistakes: [
      'Rounding the lower back',
      'Bending the standing knee too much',
      'Losing balance — go slower',
    ],
    cue: 'Push your hips back like a door closing.',
    holds: { beginner: '5 reps each', intermediate: '10 reps each', advanced: '15+ reps each' },
  },
  '90-hip': {
    name: '90/90 Hip Switch',
    emoji: '🔄',
    diagram: [
      { label: 'Both legs', detail: 'at 90°' },
      { label: 'Upright torso', detail: 'no leaning' },
      { label: 'Switch', detail: 'smoothly' },
    ],
    primary: ['Hips', 'Glutes'],
    secondary: ['Adductors', 'Lower Back', 'Core'],
    instructions: [
      'Sit with both legs bent at 90 degrees in front and behind.',
      'Keep your torso upright and tall.',
      'Lift and rotate to switch the front and back legs.',
      'Move with control, not momentum.',
      'Repeat for reps or hold each side.',
    ],
    mistakes: [
      'Leaning torso to compensate',
      'Rushing the switch without control',
      'Not keeping both legs at 90°',
    ],
    cue: 'Sit tall. Imagine a string pulling your head to the ceiling.',
    holds: { beginner: '5 each side', intermediate: '10 each side', advanced: '20+ each side' },
  },
  'cat-cow': {
    name: 'Cat-Cow',
    emoji: '🐈',
    diagram: [
      { label: 'Spine rounded', detail: 'upward (Cat)' },
      { label: 'Spine arched', detail: 'downward (Cow)' },
      { label: 'Hands under shoulders', detail: 'knees under hips' },
    ],
    primary: ['Spinal Erectors', 'Deep Core Stabilizers'],
    secondary: ['Abdominals', 'Hip Flexors', 'Glutes', 'Upper Back', 'Neck Muscles'],
    instructions: [
      'Start on all fours, hands under shoulders, knees under hips.',
      'Cat: round your spine up to the ceiling, tuck chin to chest.',
      'Cow: arch your spine down, lift chest and tailbone.',
      'Move slowly with your breath, not with momentum.',
      'Inhale on cow, exhale on cat.',
    ],
    mistakes: [
      'Bending elbows',
      'Moving too fast',
      'Not using full spinal range',
      'Shrugging shoulders toward ears',
      'Holding your breath',
    ],
    cue: 'Move with your breath, not with momentum.',
    holds: { beginner: '30–60 sec', intermediate: '60–90 sec', advanced: '90–120+ sec' },
  },
  'deep-squat': {
    name: 'Deep Squat Hold',
    emoji: '🪑',
    diagram: [
      { label: 'Feet flat', detail: 'wider than hips' },
      { label: 'Hips at', detail: 'heels' },
      { label: 'Elbows push', detail: 'knees out' },
    ],
    primary: ['Hips', 'Ankles', 'Adductors'],
    secondary: ['Quads', 'Glutes', 'Lower Back', 'Core'],
    instructions: [
      'Stand with feet slightly wider than hips.',
      'Lower into a deep squat, hips near heels.',
      'Keep heels flat on the ground.',
      'Use elbows to gently push knees outward.',
      'Hold with tall posture and steady breath.',
    ],
    mistakes: [
      'Heels lifting off the ground',
      'Rounding the lower back',
      'Collapsing chest forward',
    ],
    cue: 'Sink your hips between your ankles, not behind them.',
    holds: { beginner: '20 sec', intermediate: '60 sec', advanced: '120+ sec' },
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

  const imageSource = EXERCISE_IMAGES[id as string];

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

        {/* Exercise Image or Emoji Banner */}
        {imageSource ? (
          <View style={styles.imageCard}>
            <Image source={imageSource} style={styles.exerciseImage} resizeMode="contain" />
          </View>
        ) : (
          <View style={[styles.emojiBanner, { backgroundColor: `${Colors.orange}15`, borderColor: `${Colors.orange}30` }]}>
            <Text style={styles.emojiBannerText}>{ex.emoji}</Text>
          </View>
        )}

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

        {/* Target Holds */}
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

  imageCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  exerciseImage: {
    width: width - Spacing.lg * 2,
    height: (width - Spacing.lg * 2) * 0.75,
  },
  emojiBanner: {
    backgroundColor: `${Colors.orange}15`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${Colors.orange}30`,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emojiBannerText: {
    fontSize: FontSizes.hero,
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
// cache-bust: Tue Jun  9 02:42:51 UTC 2026
