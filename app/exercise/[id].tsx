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

// Exercise images mapping — cache-bust v4 Jun 11 2026
const EXERCISE_IMAGES: Record<string, any> = {
  'wall-sit': require('@/assets/exercises/wall-sit.png'),
  'plank': require('@/assets/exercises/plank.png'),
  'superman': require('@/assets/exercises/superman.png'),
  'push-up-hold': require('@/assets/exercises/push-up-hold.png'),
  'horse-stance': require('@/assets/exercises/horse-stance.png'),
  'cat-cow': require('@/assets/exercises/cat-cow.jpg'),
  'hip-mobility': require('@/assets/exercises/hip-mobility.jpg'),
  'shoulder-mobility': require('@/assets/exercises/shoulder-mobility.jpg'),
  'back-mobility': require('@/assets/exercises/back-mobility.jpg'),
  'hamstring-reach': require('@/assets/exercises/hamstring-reach.jpg'),
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
    emoji: '',
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
    emoji: '',
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
    emoji: '',
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
    emoji: '',
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
    emoji: '',
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
  'cat-cow': {
    name: 'Cat-Cow',
    emoji: '',
    diagram: [
      { label: 'Spine rounded', detail: 'upward (Cat)' },
      { label: 'Spine arched', detail: 'downward (Cow)' },
      { label: 'Hands under shoulders', detail: 'knees under hips' },
    ],
    primary: ['Spinal Erectors', 'Lower Back'],
    secondary: ['Abdominals', 'Hip Flexors', 'Upper Back', 'Glutes'],
    instructions: [
      'Start on all fours with hands under shoulders and knees under hips.',
      'Exhale and round your spine upward, tucking your chin toward your chest (Cat Position).',
      'Inhale and slowly arch your back while lifting your chest and gaze (Cow Position).',
      'Move smoothly between both positions.',
      'Synchronize each movement with your breathing.',
    ],
    mistakes: [
      'Moving too fast',
      'Holding your breath',
      'Not using full spinal range of motion',
      'Locking elbows',
      'Shrugging shoulders toward ears',
    ],
    cue: 'Move with your breath, not with momentum.',
    holds: { beginner: '30 sec', intermediate: '60 sec', advanced: '120+ sec' },
  },
  'hip-mobility': {
    name: 'Hip Mobility',
    emoji: '',
    diagram: [
      { label: 'Neutral spine', detail: 'upright posture' },
      { label: 'Hands on hips', detail: 'for control' },
      { label: 'Controlled circles', detail: 'full range of motion' },
    ],
    primary: ['Hip Flexors', 'Glutes'],
    secondary: ['Adductors', 'Abductors', 'Lower Back', 'Core'],
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Place hands on hips.',
      'Slowly rotate your hips in a large circular motion.',
      'Complete all repetitions in one direction.',
      'Reverse direction and repeat.',
      'Keep movements slow and controlled.',
    ],
    mistakes: [
      'Moving too fast',
      'Making small circles',
      'Leaning excessively',
      'Rotating the shoulders instead of the hips',
      'Holding your breath',
    ],
    cue: 'Draw the biggest circle possible with your hips.',
    holds: { beginner: '30 sec each direction', intermediate: '60 sec each direction', advanced: '90 sec each direction' },
  },
  'shoulder-mobility': {
    name: 'Shoulder Mobility',
    emoji: '',
    diagram: [
      { label: 'Arms extended', detail: 'to the sides' },
      { label: 'Controlled circles', detail: 'full range of motion' },
      { label: 'Relaxed shoulders', detail: 'avoid shrugging' },
    ],
    primary: ['Deltoids', 'Rotator Cuff'],
    secondary: ['Upper Trapezius', 'Rhomboids', 'Chest (Pectorals)'],
    instructions: [
      'Stand tall with feet shoulder-width apart.',
      'Extend arms straight out to your sides.',
      'Slowly perform forward arm circles.',
      'Reverse direction and perform backward arm circles.',
      'Move through a comfortable, controlled range of motion.',
      'Keep shoulders relaxed and avoid shrugging.',
    ],
    mistakes: [
      'Moving too fast',
      'Shrugging shoulders toward ears',
      'Using momentum instead of control',
      'Locking elbows rigidly',
      'Using only small circles',
    ],
    cue: 'Draw the biggest smooth circles you can without lifting your shoulders.',
    holds: { beginner: '30 sec forward / 30 sec backward', intermediate: '60 sec forward / 60 sec backward', advanced: '90+ sec forward / 90+ sec backward' },
  },
  'back-mobility': {
    name: 'Back Mobility',
    emoji: '',
    diagram: [
      { label: 'Bend forward', detail: 'slowly at waist' },
      { label: 'Stand tall', detail: 'neutral spine' },
      { label: 'Gentle extension', detail: 'lean backward' },
    ],
    primary: ['Spinal Erectors', 'Lower Back'],
    secondary: ['Upper Back', 'Lats', 'Glutes', 'Core'],
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Place hands on hips or thighs.',
      'Slowly bend forward at the waist.',
      'Return to standing.',
      'Gently lean backward without forcing the movement.',
      'Move slowly through a comfortable range of motion.',
    ],
    mistakes: [
      'Moving too quickly',
      'Forcing end ranges',
      'Holding your breath',
      'Bending knees excessively',
      'Arching the neck',
    ],
    cue: 'Move your spine smoothly—mobility, not momentum.',
    holds: { beginner: '30 sec', intermediate: '60 sec', advanced: '90+ sec' },
  },
  'hamstring-reach': {
    name: 'Hamstring Reach',
    emoji: '',
    diagram: [
      { label: 'Push hips back', detail: 'hinge at hips' },
      { label: 'Reach toward toes', detail: 'feel the stretch' },
      { label: 'Slight knee bend', detail: 'do not lock out' },
    ],
    primary: ['Hamstrings'],
    secondary: ['Calves', 'Glutes', 'Lower Back'],
    instructions: [
      'Stand with feet hip-width apart.',
      'Keep a slight bend in your knees.',
      'Push your hips backward.',
      'Reach toward your toes or the floor.',
      'Feel the stretch along the back of your legs.',
      'Return to standing under control.',
    ],
    mistakes: [
      'Locking knees completely',
      'Rounding the lower back excessively',
      'Bouncing into the stretch',
      'Holding your breath',
      'Forcing range of motion',
    ],
    cue: 'Push your hips back and lengthen your hamstrings.',
    holds: { beginner: '30 sec', intermediate: '60 sec', advanced: '90+ sec' },
  },
};

const DEFAULT: ExerciseData = {
  name: 'Exercise',
  emoji: '',
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
            <Text style={styles.star}>{fav ? '' : ''}</Text>
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
              <Text style={styles.mistakeIcon}></Text>
              <Text style={styles.mistakeText}>{m}</Text>
            </View>
          ))}
        </View>

        {/* Coach Cue */}
        <View style={styles.cueCard}>
          <Text style={styles.cueLabel}> Coach Cue</Text>
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
            <Text style={styles.ctaText}>▶ Start Workout</Text>
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
