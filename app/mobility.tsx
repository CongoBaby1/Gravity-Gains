import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#4ADE80',
  Intermediate: '#FB923C',
  Advanced: '#EF4444',
};

const MOBILITY_EXERCISES = [
  { id: 'cat-cow', name: 'Back Mobility', emoji: '', duration: '2-3 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'hip-mobility', name: 'Hip Mobility', emoji: '', duration: '2-3 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'shoulder-mobility', name: 'Shoulder Mobility', emoji: '', duration: '2-3 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'hamstring-reach', name: 'Hamstring Reach', emoji: '', duration: '2-3 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'butterfly-stretch', name: 'Butterfly Stretch', emoji: '', duration: '2-3 min', difficulty: 'Beginner', exercises: 1 },
];

function ExerciseCard({ exercise }: { exercise: typeof MOBILITY_EXERCISES[0] }) {
  const router = useRouter();
  const dColor = DIFFICULTY_COLORS[exercise.difficulty] || Colors.orange;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: dColor }]}
      activeOpacity={0.8}
      onPress={() => router.push(`/exercise/${exercise.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.emoji}>{exercise.emoji}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardName}>{exercise.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}> {exercise.duration}</Text>
            <View style={[styles.badge, { backgroundColor: `${dColor}20` }]}>
              <Text style={[styles.badgeText, { color: dColor }]}>{exercise.difficulty}</Text>
            </View>
            <Text style={styles.metaText}> {exercise.exercises} exercise{exercise.exercises > 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.startBtn, { backgroundColor: dColor }]}>
        <Text style={styles.startBtnText}>▶ Start Program</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MobilityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}> Programs</Text>
        <Text style={styles.subtitle}>Mobility Stretching — flexibility & range-of-motion</Text>
        {MOBILITY_EXERCISES.map((e) => (
          <ExerciseCard key={e.id} exercise={e} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { color: Colors.textPrimary, fontSize: FontSizes['3xl'], fontWeight: 'bold', marginBottom: Spacing.sm },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  emoji: { fontSize: 32, marginRight: Spacing.md },
  cardMeta: { flex: 1 },
  cardName: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '700', marginBottom: Spacing.xs },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.sm },
  metaText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  startBtn: {
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  startBtnText: { color: '#000', fontWeight: '700', fontSize: FontSizes.base },
});
